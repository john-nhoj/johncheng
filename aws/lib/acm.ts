import {
  Certificate,
  CertificateValidation,
} from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Construct, Stack, StackProps, Tags } from '@aws-cdk/core';

class Acm extends Stack {
  readonly hostedZone: HostedZone;
  readonly certificate: Certificate;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Route53
    this.hostedZone = new HostedZone(this, 'HostedZone', {
      zoneName: 'johncheng.me',
      comment: 'Hosted zone for my personal website',
    });

    // ACM
    this.certificate = new Certificate(this, 'Certificate', {
      domainName: 'johncheng.me',
      subjectAlternativeNames: ['*.johncheng.me'],
      validation: CertificateValidation.fromDns(this.hostedZone),
    });

    Tags.of(this.certificate).add('Name', 'johncheng-certificate');

    console.info(
      `Do not forget to change the Registar Nameservers to point to the Hosted one`
    );

    this.output();
  }

  output() {
    certificateArn: this.certificate.certificateArn;
    hostedZoneId: this.hostedZone.hostedZoneId;
  }
}

export { Acm };
