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
import { CognitoMapper } from './cognito.mapper';

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
      return CognitoMapper.mapUserFromGetUserResponse(response);
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid access token.');
    }
  }

  /**
   * Get the groups the user is a member of
   * @param {User} user - The user
   * @returns {Promise<string[]>} - The groups
   * @memberof CognitoService
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminListGroupsForUser.html
   */
  public async getUserGroups(user: User): Promise<string[]> {
    try {
      const request: AdminListGroupsForUserRequest = {
        UserPoolId: this.userPoolId,
        Username: user.username,
      };
      const response: AdminListGroupsForUserResponse =
        await this.client.adminListGroupsForUser(request);
      return CognitoMapper.mapUserGroupsFromAdminListGroupsForUserResponse(
        response,
      );
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
