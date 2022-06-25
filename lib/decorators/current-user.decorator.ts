import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { COGNITO_USER_CONTEXT_PROPERTY } from '../constants';
import { CognitoUser } from '../models';

/**
 * Decorator for the current user
 * @param {ExecutionContext} context - The context
 * @returns {CognitoUser} - The user
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CognitoUser => {
    const request = context.switchToHttp().getRequest();
    return request[COGNITO_USER_CONTEXT_PROPERTY];
  },
);
