import {
  Certificate,
  CertificateValidation,
} from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Construct, Stack, StackProps, Tags } from '@aws-cdk/core';
import { Configuration } from '../typings/config';
import { getServiceIdentifier } from '../utils';

interface AcmProps extends StackProps {
  config: Configuration;
}
class Acm extends Stack {
  readonly hostedZone: HostedZone;
  readonly certificate: Certificate;
  constructor(scope: Construct, id: string, props: AcmProps) {
    super(scope, id, props);

    const { config } = props;
    const { domainName } = config;

    const identifier = getServiceIdentifier(config);

    // Route53
    this.hostedZone = new HostedZone(this, `${identifier}-hosted-zone`, {
      zoneName: domainName,
      comment: 'Hosted zone for my personal website',
    });

    // ACM
    this.certificate = new Certificate(this, `${identifier}-certificate`, {
      domainName,
      subjectAlternativeNames: [`*.${domainName}`],
      validation: CertificateValidation.fromDns(this.hostedZone),
    });

    Tags.of(this.certificate).add('Name', `${identifier}-certificate`);

    console.info(
      `Do not forget to change the Registar Nameservers to point to the Hosted one`
    );

    this.output();
  }

  output() {
    certificateArn: this.certificate.certificateArn;
    hostedZoneId: this.hostedZone.hostedZoneId;
    nameServers: this.hostedZone.hostedZoneNameServers;
  }
}

export { Acm };
