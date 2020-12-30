export interface Configuration {
  serviceName: string;
  environment: 'dev' | 'prod';
  certificateArn: string;
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
  accountId: string;
}

export type ConfigurationKeys = keyof Configuration;
