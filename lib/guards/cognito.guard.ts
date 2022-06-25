import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractCognitoGuard } from './abstract-cognito.guard';

@Injectable()
export class CognitoGuard extends AbstractCognitoGuard {
  /**
   * Get the user from the request
   * @param {ExecutionContext} context - The request
   * @returns {Request} - The request
   * @memberof CognitoGuard
   */
  public getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
