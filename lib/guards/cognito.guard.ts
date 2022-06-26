import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractCognitoGuard } from './abstract-cognito.guard';

@Injectable()
export class CognitoGuard extends AbstractCognitoGuard {
  /**
   * Get the request from the context
   * @param {ExecutionContext} context - The context
   * @returns {Request} - The request
   * @memberof CognitoGuard
   */
  public getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
