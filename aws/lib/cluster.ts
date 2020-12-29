import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster as EcsCluster } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';

class Cluster extends Construct {
  readonly ecsCluster: EcsCluster;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    const vpc = new Vpc(this, 'public VPC');
    this.ecsCluster = new EcsCluster(this, 'EcsCluster', { vpc });
  }

  output() {}
}

export { Cluster };
