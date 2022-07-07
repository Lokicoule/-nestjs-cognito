import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { Logger } from '@nestjs/common';
import { CognitoModuleOptions } from '../cognito-module.options';

/**
 * Get the CognitoIdentityProvider instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProvider} - The CognitoIdentityProvider instance
 */
export const getCognitoIdentityProviderValue = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoIdentityProvider => {
  return new CognitoIdentityProvider(
    getConfigurationFromOptions(
      cognitoModuleOptions,
      'CognitoIdentityProvider',
    ),
  );
};

/**
 * Get the CognitoIdentityProviderClient instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProviderClient} - The CognitoIdentityProviderClient instance
 */
export const getCognitoIdentityProviderClientValue = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoIdentityProviderClient => {
  return new CognitoIdentityProviderClient(
    getConfigurationFromOptions(
      cognitoModuleOptions,
      'CognitoIdentityProviderClient',
    ),
  );
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

/**
 * Get the configuration from the CognitoModuleOptions
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @param {string} from - The name from where the configuration is coming from
 */
function getConfigurationFromOptions(
  cognitoModuleOptions: CognitoModuleOptions,
  from: string,
) {
  const logger = new Logger(from);
  const {
    region,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UserPoolId,
    ...options
  } = cognitoModuleOptions;

  if (!Boolean(region)) {
    logger.error('Region is missing. ');
  }

  return {
    region: region,
    ...options,
  };
}
