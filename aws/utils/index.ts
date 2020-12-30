import { Configuration, ConfigurationKeys } from '../typings/config';

export const getServiceIdentifier = (config: Configuration): string => {
  const { serviceName, environment } = config;
  return `${serviceName}-${environment}`;
};

export const getConfigKey = (config: Configuration, key: ConfigurationKeys) =>
  config[key];
