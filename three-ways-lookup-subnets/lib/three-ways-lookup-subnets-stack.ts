import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { SelfManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class ThreeWaysLookupSubnetsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcName: this.node.tryGetContext('vpcName')
    });

    // internal_alb_sg = ec2.SecurityGroup(
    //   self, f"{self.stack_name}-internal-alb-sg",
    //   security_group_name= f"{self.stack_name}-internal-alb-sg",
    //   vpc=aiocr_vpc,
    //   allow_all_outbound=True,
    // )

    const segurityGroup = new ec2.SecurityGroup(this, 'security-group', {
      vpc: vpc,
      allowAllOutbound: true,
    });

    const webServer = new ec2.Instance(this, 'web-server', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      vpc: vpc,
      securityGroup: segurityGroup,
      // 👇 set the subnet type to PUBLIC
      vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},
    });
  }
}