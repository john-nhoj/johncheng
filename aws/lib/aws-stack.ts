import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cfOrigins from '@aws-cdk/aws-cloudfront-origins';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as codeBuild from '@aws-cdk/aws-codebuild';
import * as ssm from '@aws-cdk/aws-ssm';
import * as ecr from '@aws-cdk/aws-ecr';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Tags } from '@aws-cdk/core';

export interface PipelineStackProps extends cdk.StackProps {
  readonly githubToken: string;
}

export class AwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: PipelineStackProps) {
    super(scope, id, props);

    // Route53
    const hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: 'johncheng.me',
      comment: 'Hosted zone for my personal website',
    });

    // ACM
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: 'johncheng.me',
      subjectAlternativeNames: ['*.johncheng.me'],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    Tags.of(certificate).add('Name', 'johncheng-certificate');

    console.info(
      `Do not forget to change the Registar Nameservers to point to the Hosted one`
    );

    // Origin
    // VPC
    const vpc = new ec2.Vpc(this, 'public VPC');
    Tags.of(vpc).add('Name', 'johncheng-vpc');

    // Cluster
    const cluster = new ecs.Cluster(this, 'myCluster', {
      vpc,
      clusterName: 'johncheng-cluster',
    });

    const ecrRepo = new ecr.Repository(this, 'ECRRepo');

    // ALB
    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'MyFargateService',
      {
        cluster,
        certificate,
        domainName: 'johncheng.me',
        domainZone: hostedZone,
        redirectHTTP: true,
        publicLoadBalancer: true,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(ecrRepo),
        },
        serviceName: 'johncheng-fargate',
      }
    );

    Tags.of(loadBalancedFargateService).add('Name', 'johncheng-alb');

    // Cloudfront
    new cloudfront.Distribution(this, 'myDist', {
      defaultBehavior: {
        origin: new cfOrigins.LoadBalancerV2Origin(
          loadBalancedFargateService.loadBalancer
        ),
      },
      comment: 'johncheng-cloudfront',
    });

    const sourceOutput = new codepipeline.Artifact('SrcOutput');
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');
    ecrRepo.grantPull(loadBalancedFargateService.taskDefinition.executionRole!);
    const containerName = loadBalancedFargateService.taskDefinition
      .defaultContainer!.containerName;

    const project = new codeBuild.PipelineProject(this, 'Project', {
      buildSpec: codeBuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              nodejs: 14,
            },
            commands: [
              // Wait until docker has started
              'nohup /usr/local/bin/dockerd --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375 --storage-driver=overlay2&',
              'timeout 15 sh -c "until docker info; do echo .; sleep 1; done"',
              'npm install -g npm',
              'pip3 install --upgrade --user awscli',
              'n stable',
              'npm install',
            ],
          },
          pre_build: {
            commands: [
              'aws --version',
              'aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 984719580259.dkr.ecr.eu-west-1.amazonaws.com',
              'COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)',
              'IMAGE_TAG=${COMMIT_HASH:=latest}',
              'npm run test',
            ],
          },
          build: {
            commands: [
              'ls -alp',
              'npm run build',
              'docker build -t $REPOSITORY_URI:latest .',
              'docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG',
            ],
          },
          post_build: {
            commands: [
              'docker push 984719580259.dkr.ecr.eu-west-1.amazonaws.com/ecrrepoc36dc9e6-dtmwdbuhjg1w:latest',
              'docker push $REPOSITORY_URI:$IMAGE_TAG',
              'printf "[{\\"name\\":\\"${CONTAINER_NAME}\\",\\"imageUri\\":\\"${REPOSITORY_URI}:latest\\"}]" > imagedefinitions.json',
            ],
          },
        },
        artifacts: {
          files: ['imagedefinitions.json'],
        },
      }),
      environment: {
        buildImage: codeBuild.LinuxBuildImage.STANDARD_1_0,
        privileged: true,
      },
      environmentVariables: {
        REPOSITORY_URI: { value: ecrRepo.repositoryUri },
        CONTAINER_NAME: { value: containerName },
      },
    });

    const secret = cdk.SecretValue.secretsManager(
      '/johncheng/dev/GITHUB_TOKEN'
    );
    const repo = ssm.StringParameter.valueForStringParameter(
      this,
      '/johncheng/dev/GITHUB_REPO'
    );
    const owner = ssm.StringParameter.valueForStringParameter(
      this,
      '/johncheng/dev/GITHUB_OWNER'
    );

    const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
      pipelineName: 'MyPipeline',
      crossAccountKeys: false,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'Checkout',
              output: sourceOutput,
              owner,
              repo,
              oauthToken: secret,
              trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
              branch: 'deploy-prod',
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Html_Build',
              project,
              input: sourceOutput,
              outputs: [cdkBuildOutput],
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.EcsDeployAction({
              actionName: 'ECSDeploy_Action',
              input: cdkBuildOutput,
              service: loadBalancedFargateService.service,
            }),
          ],
        },
      ],
    });
  }
}
