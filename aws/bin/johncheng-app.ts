#!/usr/bin/env node
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone, IHostedZone } from '@aws-cdk/aws-route53';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import 'source-map-support/register';
import { Acm } from '../lib/acm';
import { ApplicationLoadBalancer } from '../lib/alb';
import { Cloudfront } from '../lib/cloudfront';
import { Cluster } from '../lib/cluster';
import { CodeBuild } from '../lib/codeBuild';
import { prodConfig } from '../config/prod';
import { ConfigProps } from '../typings/config';

interface WebStackProps {
  config: ConfigProps;
}

class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id);

    const { config } = props;
    const { serviceName } = config;

    const cluster = new Cluster(
      this,
      `${serviceName}-cluster-construct`,
      config
    );
    const alb = new ApplicationLoadBalancer(
      this,
      `${serviceName}-alb-construct`,
      {
        cluster,
        config,
      }
    );
    new Cloudfront(this, `${serviceName}-cloudfront-construct`, {
      alb,
    });
    new CodeBuild(this, `${serviceName}-codebuild-construct`, { alb });
  }
}

const app = new App();
new Acm(app, 'acm-stack', {
  env: { region: 'us-east-1' },
});
new WebStack(app, 'prod-webstack', { config: prodConfig });
app.synth();
