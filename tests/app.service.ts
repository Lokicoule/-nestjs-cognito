import {
  AuthenticationResultType,
  CognitoIdentityProvider,
  InitiateAuthRequest,
  RespondToAuthChallengeCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectCognitoIdentityProvider } from '../lib/cognito/cognito.decorators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  /**
   * Get hello world message.
   * @returns {string}
   */
  getHello() {
    return { message: 'Hello open world!' };
  }

  /**
   * Get hello world message.
   * @returns {string}
   */
  getPrivateMessage() {
    return { message: 'Hello secure world!' };
  }

  /**
   * Get the access token for the given username and password.
   * @param {InitiateAuthRequest} request
   * @returns {Promise<AuthenticationResultType>}
   */
  public async getAccessToken(
    { username, password }: Record<string, string>,
    retry: boolean = true,
  ): Promise<AuthenticationResultType | undefined> {
    const request: InitiateAuthRequest = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    try {
      const response = await this.client.initiateAuth(request);
      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        this.completeChallenge({
          username,
          password,
          session: response.Session || '',
        });
        if (retry) {
          return this.getAccessToken({ username, password }, false);
        }
      }
      return response.AuthenticationResult;
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid username or password.');
    }
  }

  /**
   * Complete the challenge with the given password.
   * @param {string} username
   * @param {string} password
   * @param {string} session
   * @returns {Promise<AuthenticationResultType>}
   */
  public async completeChallenge({
    username,
    password,
    session,
  }: Record<string, string>) {
    const request: RespondToAuthChallengeCommandInput = {
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: password,
      },
      Session: session,
    };
    try {
      return await this.client.respondToAuthChallenge(request);
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid username or password.');
    }
  }
}
