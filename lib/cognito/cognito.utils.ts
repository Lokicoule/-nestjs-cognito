import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Logger } from '@nestjs/common';
import { CognitoModuleOptions } from '../cognito-module.options';

/**
 * Get the CognitoIdentityProvider instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProvider} - The CognitoIdentityProvider instance
 */
export const getCognitoIdentityProviderValue = (
  cognitoModuleOptions: CognitoModuleOptions,
) => {
  const logger = new Logger(getCognitoIdentityProviderValue.name);

  if (!Boolean(cognitoModuleOptions.region)) {
    logger.error('Region is missing. ');
  }
  if (!Boolean(cognitoModuleOptions.credentials)) {
    logger.error('Credentials are missing.');
  }
  return new CognitoIdentityProvider({
    region: cognitoModuleOptions.region,
    credentials: cognitoModuleOptions.credentials,
  });
};

/**
 * Get the UserPoolId
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {string} - The UserPoolId
 */
export const getUserPoolIdProviderValue = (
  cognitoModuleOptions: CognitoModuleOptions,
) => {
  const logger = new Logger(getUserPoolIdProviderValue.name);

  if (!Boolean(cognitoModuleOptions.UserPoolId)) {
    logger.warn(
      'UserPoolId is missing, Authorization needs this property to work.',
    );
  }
  return cognitoModuleOptions.UserPoolId || undefined;
};
