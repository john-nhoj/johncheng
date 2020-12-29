#!/usr/bin/env node
import { App, Construct, Stack } from '@aws-cdk/core';
import 'source-map-support/register';
import { Acm } from '../lib/acm';
import { ApplicationLoadBalancer } from '../lib/alb';
import { Cloudfront } from '../lib/cloudfront';
import { Cluster } from '../lib/cluster';
import { CodeBuild } from '../lib/codeBuild';

class WebStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const acm = new Acm(this, 'johncheng-acm-stack');
    const cluster = new Cluster(this, 'johncheng-cluster-construct');
    const alb = new ApplicationLoadBalancer(this, 'johncheng-alb-construct', {
      acm,
      cluster,
    });
    const cloudfront = new Cloudfront(this, 'johncheng-cloudfront-construct', {
      alb,
    });
    const codeBuildProject = new CodeBuild(
      this,
      'johncheng-codebuild-construct',
      { alb }
    );
  }
}

const app = new App();
const webStack = new WebStack(app, 'johncheng-webstack');
app.synth();
