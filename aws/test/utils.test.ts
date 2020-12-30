import { Configuration } from '../typings/config';
import { getServiceIdentifier, getConfigKey } from '../utils';

test('Utils test', () => {
  const mockConfig: Configuration = {
    serviceName: 'foobar',
    environment: 'prod',
    certificateArn: 'TBA',
    hostedZoneId: 'TBA',
    hostedZoneName: 'TBA',
    domainName: 'TBA',
    accountId: '9xxxxxxxxx59',
  };

  const mockCallback = (identifier: string, assetId: string) =>
    `${identifier}-${assetId}`;

  expect(getServiceIdentifier(mockConfig)).toBe('foobar-prod');
  expect(getConfigKey(mockConfig, 'serviceName')).toBe(mockConfig.serviceName);
});
