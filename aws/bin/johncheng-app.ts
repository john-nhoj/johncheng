#!/usr/bin/env node
import { App, Construct, Stack } from '@aws-cdk/core';
import 'source-map-support/register';
import { Acm } from '../lib/acm';
import { ApplicationLoadBalancer } from '../lib/alb';
import { Cloudfront } from '../lib/cloudfront';
import { Cluster } from '../lib/cluster';
import { CodeBuild } from '../lib/codeBuild';

interface WebStackProps {
  acm: Acm;
}
class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id);
    const { acm } = props;

    const cluster = new Cluster(this, 'johncheng-cluster-construct');
    const alb = new ApplicationLoadBalancer(this, 'johncheng-alb-construct', {
      acm,
      cluster,
    });
    new Cloudfront(this, 'johncheng-cloudfront-construct', {
      alb,
    });
    new CodeBuild(this, 'johncheng-codebuild-construct', { alb });
  }
}

const app = new App();
const AcmStack = new Acm(app, 'johncheng-acm-stack');
new WebStack(app, 'johncheng-webstack', { acm: AcmStack });
app.synth();
