import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cfOrigins from '@aws-cdk/aws-cloudfront-origins';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';

export class AwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
  }
}
