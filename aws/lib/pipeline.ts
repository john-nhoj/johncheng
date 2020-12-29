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
import { ApplicationLoadBalancer } from './alb';
import { CodeBuild } from './codeBuild';

interface CodePipelineProps {
  codeBuild: CodeBuild;
  alb: ApplicationLoadBalancer;
}
class CodePipeline extends Construct {
  constructor(scope: Construct, id: string, props: CodePipelineProps) {
    super(scope, id);

    const {
      codeBuild: { codeBuildProject },
      alb,
    } = props;

    const secret = SecretValue.secretsManager('/johncheng/dev/GITHUB_TOKEN');
    const repo = StringParameter.valueForStringParameter(
      this,
      '/johncheng/dev/GITHUB_REPO'
    );
    const owner = StringParameter.valueForStringParameter(
      this,
      '/johncheng/dev/GITHUB_OWNER'
    );
    const sourceOutput = new Artifact('SrcOutput');
    const cdkBuildOutput = new Artifact('CdkBuildOutput');

    new Pipeline(this, 'MyFirstPipeline', {
      pipelineName: 'MyPipeline',
      crossAccountKeys: false,
      stages: [
        this.createSourceStage(sourceOutput, owner, repo, secret),
        this.createBuildStage(codeBuildProject, sourceOutput, cdkBuildOutput),
        this.createDeployStage(cdkBuildOutput, alb.alb.service),
      ],
    });
  }
  createDeployStage(
    cdkBuildOutput: Artifact,
    service: FargateService
  ): StageProps {
    return {
      stageName: 'Deploy',
      actions: [
        new EcsDeployAction({
          actionName: 'ECSDeploy_Action',
          input: cdkBuildOutput,
          service,
        }),
      ],
    };
  }

  private createSourceStage(
    sourceOutput: Artifact,
    owner: string,
    repo: string,
    oauthToken: SecretValue
  ): StageProps {
    return {
      stageName: 'Source',
      actions: [
        new GitHubSourceAction({
          actionName: 'Checkout',
          output: sourceOutput,
          owner,
          repo,
          oauthToken,
          trigger: GitHubTrigger.WEBHOOK,
          branch: 'deploy-prod',
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
          actionName: 'Html_Build',
          project: codeBuildProject,
          input: sourceOutput,
          outputs: [cdkBuildOutput],
        }),
      ],
    };
  }
}

export { CodePipeline };
