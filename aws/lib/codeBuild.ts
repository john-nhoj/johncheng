import {
  BuildSpec,
  LinuxBuildImage,
  PipelineProject,
} from '@aws-cdk/aws-codebuild';
import { Construct } from '@aws-cdk/core';
import { Configuration } from '../typings/config';
import { ApplicationLoadBalancer } from './alb';

interface CodeBuildProps {
  alb: ApplicationLoadBalancer;
  config: Configuration;
  identifier: string;
}

class CodeBuild extends Construct {
  readonly codeBuildProject: PipelineProject;
  constructor(scope: Construct, id: string, props: CodeBuildProps) {
    super(scope, id);

    // The second alb is actually the fargate service
    // More info: https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ecs-patterns.ApplicationLoadBalancedFargateService.html
    const {
      alb: { ecrRepo, alb: fargateService },
      config: { accountId },
      identifier,
    } = props;

    const containerName = fargateService.taskDefinition.defaultContainer!
      .containerName;

    this.codeBuildProject = new PipelineProject(
      this,
      `${identifier}-code-build`,
      {
        buildSpec: this.getBuildSpec(accountId),
        environment: {
          buildImage: LinuxBuildImage.STANDARD_1_0,
          privileged: true,
        },
        environmentVariables: {
          REPOSITORY_URI: { value: ecrRepo.repositoryUri },
          CONTAINER_NAME: { value: containerName },
        },
      }
    );
  }

  private getBuildSpec(accountId: string): BuildSpec {
    return BuildSpec.fromObject({
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
            `aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.eu-west-1.amazonaws.com`,
            'COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)',
            'IMAGE_TAG=${COMMIT_HASH:=latest}',
            'npm run test',
          ],
        },
        build: {
          commands: [
            'npm run build',
            'docker build -t $REPOSITORY_URI:latest .',
            'docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG',
          ],
        },
        post_build: {
          commands: [
            'docker push $REPOSITORY_URI:latest',
            'docker push $REPOSITORY_URI:$IMAGE_TAG',
            'printf "[{\\"name\\":\\"${CONTAINER_NAME}\\",\\"imageUri\\":\\"${REPOSITORY_URI}:latest\\"}]" > imagedefinitions.json',
          ],
        },
      },
      artifacts: {
        files: ['imagedefinitions.json'],
      },
    });
  }
}

export { CodeBuild };
