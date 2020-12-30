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

class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: ConfigProps) {
    super(scope, id);

    const { serviceName, certificateArn } = props;

    const cluster = new Cluster(this, `${serviceName}-cluster-construct`);
    const alb = new ApplicationLoadBalancer(
      this,
      `${serviceName}-alb-construct`,
      {
        certificate: this.getCertificate(serviceName, certificateArn),
        hostedZone: this.getHostedZone(serviceName),
        cluster,
      }
    );
    new Cloudfront(this, `${serviceName}-cloudfront-construct`, {
      alb,
    });
    new CodeBuild(this, `${serviceName}-codebuild-construct`, { alb });
  }

  private getCertificate(serviceName: string, certificateArn: string) {
    const certificate = Certificate.fromCertificateArn(
      this,
      `${serviceName}-certificate`,
      certificateArn
    );
    return certificate;
  }

  private getHostedZone(serviceName: string): IHostedZone {
    const hostedZoneId = '';
    const hostedZone = HostedZone.fromHostedZoneId(
      this,
      `${serviceName}-hosted-zone`,
      hostedZoneId
    );
    return hostedZone;
  }
}

const app = new App();
new Acm(app, 'acm-stack', {
  env: { region: 'us-east-1' },
});
new WebStack(app, 'prod-webstack', prodConfig);
app.synth();
