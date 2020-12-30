import { ConfigProps } from '../typings/config';
import {
  getServiceIdentifier,
  getConfigKey,
  extractIdentifierFromConfigAndReturnAsset,
} from '../utils';

test('Utils test', () => {
  const mockConfig: ConfigProps = {
    serviceName: 'foobar',
    environment: 'prod',
    certificateArn: 'TBA',
    hostedZoneId: 'TBA',
    accountId: '9xxxxxxxxx59',
  };

  const mockCallback = (identifier: string, assetId: string) =>
    `${identifier}-${assetId}`;

  expect(getServiceIdentifier(mockConfig)).toBe('foobar-prod');
  expect(getConfigKey(mockConfig, 'serviceName')).toBe(mockConfig.serviceName);
  expect(
    extractIdentifierFromConfigAndReturnAsset(
      mockConfig,
      'serviceName',
      mockCallback
    )
  ).toBe(
    `${mockConfig.serviceName}-${mockConfig.environment}-${mockConfig.serviceName}`
  );
});
