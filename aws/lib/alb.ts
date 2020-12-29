import { LoadBalancerV2Origin } from '@aws-cdk/aws-cloudfront-origins';
import { Repository } from '@aws-cdk/aws-ecr';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { Construct } from '@aws-cdk/core';
import { Acm } from './acm';
import { Cluster } from './cluster';

interface AlbProps {
  readonly cluster: Cluster;
  readonly acm: Acm;
}

class ApplicationLoadBalancer extends Construct {
  readonly alb: ApplicationLoadBalancedFargateService;
  readonly loadBalancer;
  readonly ecrRepo: Repository;
  constructor(scope: Construct, id: string, props: AlbProps) {
    super(scope, id);

    const {
      cluster,
      acm: { certificate, hostedZone },
    } = props;

    this.ecrRepo = new Repository(this, 'ECRRepo');
    this.alb = new ApplicationLoadBalancedFargateService(
      this,
      'MyFargateService',
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
      }
    );
    this.loadBalancer = this.alb.loadBalancer;
    this.ecrRepo.grantPull(this.alb.taskDefinition.executionRole!);
  }
}

export { ApplicationLoadBalancer };
