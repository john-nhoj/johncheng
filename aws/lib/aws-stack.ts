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

export interface PipelineStackProps extends cdk.StackProps {
  readonly githubToken: string;
}

export class AwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: PipelineStackProps) {
    super(scope, id, props);

    // Route53
    const myHostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: 'johncheng.me',
    });

    // ACM
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: '*.johncheng.me',
      validation: acm.CertificateValidation.fromDns(myHostedZone),
    });

    console.info(
      `Do not forget to change the Registar Nameservers to point to the Hosted one`
    );

    // Origin
    // VPC
    const vpc = new ec2.Vpc(this, 'public VPC');

    // Cluster
    const cluster = new ecs.Cluster(this, 'myCluster', {
      vpc,
    });

    // ALB
    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'MyFargateService',
      {
        cluster,
        certificate,
        domainName: 'johncheng.me',
        domainZone: myHostedZone,
        redirectHTTP: true,
        publicLoadBalancer: true,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('nginx:latest'),
        },
      }
    );

    // Cloudfront
    new cloudfront.Distribution(this, 'myDist', {
      defaultBehavior: {
        origin: new cfOrigins.LoadBalancerV2Origin(
          loadBalancedFargateService.loadBalancer
        ),
      },
    });

    const sourceOutput = new codepipeline.Artifact('SrcOutput');
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');

    const project = new codeBuild.PipelineProject(this, 'Project', {});

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
      ],
    });
  }
}
