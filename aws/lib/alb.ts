import { Certificate, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Repository } from '@aws-cdk/aws-ecr';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { HostedZone, IHostedZone } from '@aws-cdk/aws-route53';
import { Construct } from '@aws-cdk/core';
import { ConfigProps } from '../typings/config';
import {
  extractIdentifierFromConfigAndReturnAsset,
  getServiceIdentifier,
} from '../utils';
import { Cluster } from './cluster';

interface AlbProps {
  readonly cluster: Cluster;
  readonly config: ConfigProps;
  readonly identifier: string;
}

class ApplicationLoadBalancer extends Construct {
  readonly alb: ApplicationLoadBalancedFargateService;
  readonly loadBalancer;
  readonly ecrRepo: Repository;
  constructor(scope: Construct, id: string, props: AlbProps) {
    super(scope, id);

    const { cluster, config, identifier } = props;
    const certificate = extractIdentifierFromConfigAndReturnAsset<ICertificate>(
      config,
      'certificateArn',
      this.getCertificate
    );
    const hostedZone = extractIdentifierFromConfigAndReturnAsset<IHostedZone>(
      config,
      'hostedZoneId',
      this.getHostedZone
    );

    this.ecrRepo = new Repository(this, `${identifier}-public`, {
      repositoryName: `${identifier}-public`,
    });
    this.alb = new ApplicationLoadBalancedFargateService(
      this,
      `${identifier}-fargate-alb`,
      {
        cluster: cluster.ecsCluster,
        certificate,
        domainName: 'johncheng.me',
        domainZone: hostedZone,
        redirectHTTP: true,
        publicLoadBalancer: true,
        taskImageOptions: {
          image: ContainerImage.fromEcrRepository(this.ecrRepo),
        },
        serviceName: `${identifier}-fargate`,
      }
    );
    this.loadBalancer = this.alb.loadBalancer;
    this.ecrRepo.grantPull(this.alb.taskDefinition.executionRole!);
  }

  private getCertificate(
    identifier: string,
    certificateArn: string
  ): ICertificate {
    const certificate = Certificate.fromCertificateArn(
      this,
      `${identifier}-certificate`,
      certificateArn
    );
    return certificate;
  }

  private getHostedZone(identifier: string, hostedZoneId: string): IHostedZone {
    const hostedZone = HostedZone.fromHostedZoneId(
      this,
      `${identifier}-hosted-zone`,
      hostedZoneId
    );
    return hostedZone;
  }
}

export { ApplicationLoadBalancer };
