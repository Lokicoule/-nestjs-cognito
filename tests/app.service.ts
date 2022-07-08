import {
  AuthenticationResultType,
  CognitoIdentityProvider,
  InitiateAuthRequest,
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

  getHello() {
    return { message: 'Hello open world!' };
  }

  getPrivateMessage() {
    return { message: 'Hello secure world!' };
  }

  public async getAccessToken({
    username,
    password,
  }: Record<string, string>): Promise<AuthenticationResultType | undefined> {
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
      console.log(response);
      return response.AuthenticationResult;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error, 'Invalid username or password.');
    }
  }
}
