#!/usr/bin/env node
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import 'source-map-support/register';
import { Acm } from '../lib/acm';
import { ApplicationLoadBalancer } from '../lib/alb';
import { Cloudfront } from '../lib/cloudfront';
import { Cluster } from '../lib/cluster';
import { CodeBuild } from '../lib/codeBuild';
import { prodConfig } from '../config/prod';
import { Configuration } from '../typings/config';
import { getServiceIdentifier } from '../utils';

interface WebStackProps {
  config: Configuration;
}

class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id);

    const { config } = props;
    const identifier = getServiceIdentifier(config);

    const cluster = new Cluster(
      this,
      `${identifier}-cluster-construct`,
      identifier
    );
    const alb = new ApplicationLoadBalancer(
      this,
      `${identifier}-alb-construct`,
      {
        cluster,
        config,
        identifier,
      }
    );
    new Cloudfront(this, `${identifier}-cloudfront-construct`, {
      alb,
      identifier,
    });
    new CodeBuild(this, `${identifier}-codebuild-construct`, {
      alb,
      config,
      identifier,
    });
  }
}

const app = new App();
const identifier = getServiceIdentifier(prodConfig);
new Acm(app, `${identifier}-certificate`, {
  env: { region: 'us-east-1' },
  config: prodConfig,
});
new WebStack(app, `${identifier}-service`, { config: prodConfig });
app.synth();
