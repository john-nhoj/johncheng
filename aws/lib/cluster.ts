import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster as EcsCluster } from '@aws-cdk/aws-ecs';
import { Construct, Tags } from '@aws-cdk/core';

class Cluster extends Construct {
  readonly ecsCluster: EcsCluster;

  constructor(scope: Construct, id: string, identifier: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'public VPC');
    Tags.of(vpc).add('Name', `${identifier}-vpc`);

    this.ecsCluster = new EcsCluster(this, 'EcsCluster', {
      vpc,
      clusterName: `${identifier}-cluster`,
    });
  }

  output() {}
}

export { Cluster };
