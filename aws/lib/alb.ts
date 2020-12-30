import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Repository } from '@aws-cdk/aws-ecr';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { Construct } from '@aws-cdk/core';
import { Cluster } from './cluster';

interface AlbProps {
  readonly cluster: Cluster;
  readonly certificate: ICertificate;
  readonly hostedZone: IHostedZone;
}

class ApplicationLoadBalancer extends Construct {
  readonly alb: ApplicationLoadBalancedFargateService;
  readonly loadBalancer;
  readonly ecrRepo: Repository;
  constructor(scope: Construct, id: string, props: AlbProps) {
    super(scope, id);

    const { cluster, certificate, hostedZone } = props;

    this.ecrRepo = new Repository(this, 'johncheng-public', {
      repositoryName: 'johncheng-public',
    });
    this.alb = new ApplicationLoadBalancedFargateService(
      this,
      'johncheng-fargate-alb',
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
        serviceName: 'johncheng-fargate',
      }
    );
    this.loadBalancer = this.alb.loadBalancer;
    this.ecrRepo.grantPull(this.alb.taskDefinition.executionRole!);
  }
}

export { ApplicationLoadBalancer };
