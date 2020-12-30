import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster as EcsCluster } from '@aws-cdk/aws-ecs';
import { Construct, Tags } from '@aws-cdk/core';
import { ConfigProps } from '../typings/config';

class Cluster extends Construct {
  readonly ecsCluster: EcsCluster;

  constructor(scope: Construct, id: string, props: ConfigProps) {
    super(scope, id);

    const { serviceName, environment } = props;

    const vpc = new Vpc(this, 'public VPC');
    Tags.of(vpc).add('Name', `${serviceName}-${environment}-vpc`);

    this.ecsCluster = new EcsCluster(this, 'EcsCluster', {
      vpc,
      clusterName: `${serviceName}-${environment}-cluster`,
    });
  }

  output() {}
}

export { Cluster };
