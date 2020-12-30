import { Certificate, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Repository } from '@aws-cdk/aws-ecr';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import {
  ApplicationLoadBalancedFargateService,
  ApplicationLoadBalancedFargateServiceProps,
} from '@aws-cdk/aws-ecs-patterns';
import { HostedZone, IHostedZone } from '@aws-cdk/aws-route53';
import { Construct } from '@aws-cdk/core';
import { Configuration } from '../typings/config';
import { Cluster } from './cluster';
import { IApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';

interface AlbProps {
  readonly cluster: Cluster;
  readonly config: Configuration;
  readonly identifier: string;
}

class ApplicationLoadBalancer extends Construct {
  readonly alb: ApplicationLoadBalancedFargateService;
  readonly loadBalancer: IApplicationLoadBalancer;
  readonly ecrRepo: Repository;
  constructor(scope: Construct, id: string, props: AlbProps) {
    super(scope, id);

    const { cluster, config, identifier } = props;

    const certificate = this.getCertificate(config, identifier);
    const hostedZone = this.getHostedZone(config, identifier);

    this.ecrRepo = this.createEcrRepo(config, identifier);

    const albConfig = this.createAlbConfig(
      config,
      cluster,
      certificate,
      hostedZone,
      identifier
    );
    this.alb = this.createAlb(identifier, albConfig);
    this.loadBalancer = this.alb.loadBalancer;
    this.ecrRepo.grantPull(this.alb.taskDefinition.executionRole!);
  }

  private createAlb(
    identifier: string,
    albConfig: ApplicationLoadBalancedFargateServiceProps
  ): ApplicationLoadBalancedFargateService {
    return new ApplicationLoadBalancedFargateService(
      this,
      `${identifier}-fargate-alb`,
      albConfig
    );
  }

  private createAlbConfig(
    config: Configuration,
    cluster: Cluster,
    certificate: ICertificate,
    hostedZone: IHostedZone,
    identifier: string
  ) {
    return {
      cluster: cluster.ecsCluster,
      certificate,
      domainName: config.domainName,
      domainZone: hostedZone,
      redirectHTTP: true,
      publicLoadBalancer: true,
      taskImageOptions: {
        image: ContainerImage.fromEcrRepository(this.ecrRepo),
      },
      serviceName: `${identifier}-fargate`,
    };
  }

  private createEcrRepo(config: Configuration, identifier: string): Repository {
    return new Repository(this, `${identifier}-public`, {
      repositoryName: `${identifier}-public`,
    });
  }
  private getHostedZone(config: Configuration, identifier: string) {
    return HostedZone.fromHostedZoneAttributes(
      this,
      `${identifier}-hosted-zone`,
      {
        hostedZoneId: config.hostedZoneId,
        zoneName: config.hostedZoneName,
      }
    );
  }
  private getCertificate(config: Configuration, identifier: string) {
    return Certificate.fromCertificateArn(
      this,
      `${identifier}-certificate`,
      config.certificateArn
    );
  }
}

export { ApplicationLoadBalancer };
