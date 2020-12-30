import { ConfigProps, ConfigPropsKeys } from '../typings/config';

export const getServiceIdentifier = (config: ConfigProps): string => {
  const { serviceName, environment } = config;
  return `${serviceName}-${environment}`;
};

export const getConfigKey = (config: ConfigProps, key: ConfigPropsKeys) =>
  config[key];

export const extractIdentifierFromConfigAndReturnAsset = <T>(
  config: ConfigProps,
  key: ConfigPropsKeys,
  callback: (identifier: string, assetId: string) => T
): T => {
  const identifier = getServiceIdentifier(config);
  const assetId = getConfigKey(config, key);
  return callback(identifier, assetId);
};
