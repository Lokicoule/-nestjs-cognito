import {
  AdminListGroupsForUserRequest,
  AdminListGroupsForUserResponse,
  CognitoIdentityProvider,
  GetUserRequest,
  GetUserResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.model';
import {
  InjectCognitoIdentityProvider,
  InjectCognitoUserPoolId,
} from './cognito.decorators';

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
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    @InjectCognitoUserPoolId()
    private readonly userPoolId: string,
  ) {}

  /**
   * Get the user from the Cognito user pool
   * @param {string} accessToken - The access token
   * @returns {Promise<User>} - The user
   * @throws {UnauthorizedException} - If the user is not found
   * @memberof CognitoService
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html
   */
  public async getUser(accessToken: string): Promise<User> {
    try {
      const request: GetUserRequest = {
        AccessToken: accessToken,
      };
      const response: GetUserResponse = await this.client.getUser(request);
      return User.fromGetUserResponse(response);
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid access token.');
    }
  }

  public async getUserGroups(user: User): Promise<User> {
    try {
      const request: AdminListGroupsForUserRequest = {
        UserPoolId: this.userPoolId,
        Username: user.username,
      };
      const response: AdminListGroupsForUserResponse =
        await this.client.adminListGroupsForUser(request);
      user.addGroupsFromAdminListGroupsForUserResponse(response);
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
