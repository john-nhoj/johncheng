import { Distribution } from '@aws-cdk/aws-cloudfront';
import { LoadBalancerV2Origin } from '@aws-cdk/aws-cloudfront-origins';
import { Construct } from '@aws-cdk/core';
import { ApplicationLoadBalancer } from './alb';

interface CloudfrontProps {
  alb: ApplicationLoadBalancer;
  identifier: string;
}
class Cloudfront extends Construct {
  readonly cf: Distribution;
  constructor(scope: Construct, id: string, props: CloudfrontProps) {
    super(scope, id);

    const {
      alb: { loadBalancer },
      identifier,
    } = props;

    this.cf = new Distribution(this, `${identifier}-cloudfront`, {
      defaultBehavior: {
        origin: new LoadBalancerV2Origin(loadBalancer),
      },
      comment: `${identifier}-cloudfront`,
    });
  }
}

export { Cloudfront };
