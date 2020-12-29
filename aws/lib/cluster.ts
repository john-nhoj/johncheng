import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster as EcsCluster } from '@aws-cdk/aws-ecs';
import { Construct, Tags } from '@aws-cdk/core';

class Cluster extends Construct {
  readonly ecsCluster: EcsCluster;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'public VPC');
    Tags.of(vpc).add('Name', 'johncheng-vpc');

    this.ecsCluster = new EcsCluster(this, 'EcsCluster', {
      vpc,
      clusterName: 'johncheng-cluster-public',
    });
  }

  output() {}
}

export { Cluster };
