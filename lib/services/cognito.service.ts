import {
  CognitoIdentityProvider,
  GetUserRequest,
  GetUserResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { COGNITO_INSTANCE_TOKEN } from '../constants/cognito.constants';
import { CognitoUser } from '../models/cognito-user.model';

@Injectable()
export class CognitoService {
  /**
   * The Cognito client
   * @private
   * @type {CognitoIdentityProvider}
   * @memberof CognitoService
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityProvider.html
   */
  constructor(
    @Inject(COGNITO_INSTANCE_TOKEN)
    private readonly client: CognitoIdentityProvider,
  ) {}

  /**
   * Get the user from the Cognito user pool
   * @param {string} username - The username
   * @returns {Promise<CognitoUser>} - The user
   * @throws {UnauthorizedException} - If the user is not found
   * @throws {Error} - If there is an error
   * @memberof CognitoService
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_RequestParameters
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_ResponseElements
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_ResponseElements_UserAttributes
   */
  public async getUser(accessToken: string): Promise<CognitoUser> {
    try {
      const request: GetUserRequest = {
        AccessToken: accessToken,
      };
      const response: GetUserResponse = await this.client.getUser(request);
      return CognitoUser.fromGetUserResponse(response);
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid access token.');
    }
  }
}
