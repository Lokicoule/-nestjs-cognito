import {
  CognitoIdentityProvider,
  GetUserRequest,
  GetUserResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.model';
import { InjectCognitoIdentityProvider } from './cognito.decorators';
import { UserMapper } from './mappers/user.mapper';
@Injectable()
export class CognitoService {
  /**
   * The Cognito client
   * @private
   * @type {CognitoIdentityProvider}
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityProvider.html
   */
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Get the user from the Cognito user pool
   * @param {string} accessToken - The access token
   * @returns {Promise<User>} - The user
   * @throws {UnauthorizedException} - If the user is not found
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html
   */
  public async getUser(accessToken: string): Promise<User> {
    try {
      const request: GetUserRequest = {
        AccessToken: accessToken,
      };
      const response: GetUserResponse = await this.client.getUser(request);
      return UserMapper.fromGetUserAndDecodedJwt(
        response,
        this.jwtService.decode(accessToken),
      );
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid access token.');
    }
  }
}
