export interface ConfigProps {
  serviceName: string;
  environment: 'dev' | 'prod';
  certificateArn: string;
  hostedZoneId: string;
}

export type ConfigPropsKeys = keyof ConfigProps;
