import { ExecutionContext, Injectable } from '@nestjs/common';
import { AbstractGuard } from '../abstract.guard';

@Injectable()
export class AuthenticationGuard extends AbstractGuard {
  /**
   * Get the request from the context
   * @param {ExecutionContext} context - The context
   * @returns {Request} - The request
   */
  public getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
