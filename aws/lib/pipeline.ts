import { PipelineProject } from '@aws-cdk/aws-codebuild';
import { Artifact, Pipeline, StageProps } from '@aws-cdk/aws-codepipeline';
import {
  CodeBuildAction,
  EcsDeployAction,
  GitHubSourceAction,
  GitHubTrigger,
} from '@aws-cdk/aws-codepipeline-actions';
import { FargateService } from '@aws-cdk/aws-ecs';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { Construct, SecretValue } from '@aws-cdk/core';
import { Configuration } from '../typings/config';
import { ApplicationLoadBalancer } from './alb';
import { CodeBuild } from './codeBuild';

interface CodePipelineProps {
  codeBuild: CodeBuild;
  alb: ApplicationLoadBalancer;
  identifier: string;
  config: Configuration;
}
class CodePipeline extends Construct {
  constructor(scope: Construct, id: string, props: CodePipelineProps) {
    super(scope, id);

    const {
      codeBuild: { codeBuildProject },
      alb: { alb: fargateService },
      config: { environment, serviceName },
      identifier,
    } = props;

    const secret = SecretValue.secretsManager(
      `/${serviceName}/dev/GITHUB_TOKEN`
    );
    const repo = StringParameter.valueForStringParameter(
      this,
      `/${serviceName}/dev/GITHUB_REPO`
    );
    const owner = StringParameter.valueForStringParameter(
      this,
      `/${serviceName}/dev/GITHUB_OWNER`
    );
    const sourceOutput = new Artifact('SrcOutput');
    const cdkBuildOutput = new Artifact('CdkBuildOutput');

    new Pipeline(this, `${serviceName}-code-pipeline`, {
      pipelineName: identifier,
      crossAccountKeys: false,
      stages: [
        this.createSourceStage(sourceOutput, owner, repo, secret, environment),
        this.createBuildStage(codeBuildProject, sourceOutput, cdkBuildOutput),
        this.createDeployStage(cdkBuildOutput, fargateService.service),
      ],
    });
  }

  private createSourceStage(
    sourceOutput: Artifact,
    owner: string,
    repo: string,
    oauthToken: SecretValue,
    environment: string
  ): StageProps {
    return {
      stageName: 'Source',
      actions: [
        new GitHubSourceAction({
          actionName: 'Source',
          output: sourceOutput,
          owner,
          repo,
          oauthToken,
          trigger: GitHubTrigger.WEBHOOK,
          branch: `deploy-${environment}`,
        }),
      ],
    };
  }

  private createBuildStage(
    codeBuildProject: PipelineProject,
    sourceOutput: Artifact,
    cdkBuildOutput: Artifact
  ): StageProps {
    return {
      stageName: 'Build',
      actions: [
        new CodeBuildAction({
          actionName: 'BuildApp',
          project: codeBuildProject,
          input: sourceOutput,
          outputs: [cdkBuildOutput],
        }),
      ],
    };
  }

  createDeployStage(
    cdkBuildOutput: Artifact,
    service: FargateService
  ): StageProps {
    return {
      stageName: 'Deploy',
      actions: [
        new EcsDeployAction({
          actionName: 'AssetUpload',
          input: cdkBuildOutput,
          service,
        }),
      ],
    };
  }
}

export { CodePipeline };
