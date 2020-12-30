import { Configuration } from '../typings/config';

const prodConfig: Configuration = {
  serviceName: 'johncheng',
  environment: 'prod',
  certificateArn:
    'arn:aws:acm:eu-west-1:984719580259:certificate/9df11d75-b62b-43c7-bee7-1584955f474b',
  hostedZoneId: 'Z008680416780D4AYAHTT',
  hostedZoneName: 'johncheng.me',
  accountId: '984719580259',
  domainName: 'johncheng.me',
};

export { prodConfig };
