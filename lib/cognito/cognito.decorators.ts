import { Inject } from '@nestjs/common';
import {
  COGNITO_INSTANCE_TOKEN,
  COGNITO_USER_POOL_ID,
} from './cognito.constants';

export function InjectCognitoIdentityProvider() {
  return Inject(COGNITO_INSTANCE_TOKEN);
}

export function InjectCognitoUserPoolId() {
  return Inject(COGNITO_USER_POOL_ID);
}
