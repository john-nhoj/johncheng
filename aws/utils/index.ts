import { ConfigProps } from '../typings/config';

export const getServiceIdentifier = (config: ConfigProps): string => {
  const { serviceName, environment } = config;
  return `${serviceName}-${environment}`;
};

export const extractIdentifierFromConfigAndReturnAsset = <T>(
  config: ConfigProps,
  callback: (identifier: string, certificateArn: string) => T
): T => {
  const identifier = getServiceIdentifier(config);
  return callback(identifier, config.certificateArn);
};
