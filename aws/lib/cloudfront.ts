import { Distribution } from '@aws-cdk/aws-cloudfront';
import { LoadBalancerV2Origin } from '@aws-cdk/aws-cloudfront-origins';
import { Construct } from '@aws-cdk/core';
import { ApplicationLoadBalancer } from './alb';

interface CloudfrontProps {
  alb: ApplicationLoadBalancer;
}
class Cloudfront extends Construct {
  readonly cf: Distribution;
  constructor(scope: Construct, id: string, props: CloudfrontProps) {
    super(scope, id);

    const {
      alb: { loadBalancer },
    } = props;

    this.cf = new Distribution(this, 'myDist', {
      defaultBehavior: {
        origin: new LoadBalancerV2Origin(loadBalancer),
      },
    });
  }
}

export { Cloudfront };
