import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CognitoService } from './cognito/cognito.service';
import { COGNITO_USER_CONTEXT_PROPERTY } from './user/user.constants';
import { User } from './user/user.model';
import { ValidatorService } from './validators/validator.service';

@Injectable()
export abstract class AbstractGuard implements CanActivate {
  constructor(
    protected readonly cognitoService: CognitoService,
    protected readonly validatorService: ValidatorService,
  ) {}

  /**
   * Check if the user is authenticated
   * @param {ExecutionContext} context - The execution context
   * @returns {Promise<boolean>} - True or false if the user is authenticated or not and has the required roles
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const authorization = this.getAuthorizationToken(request);
    const user: User = await this.cognitoService.getUser(authorization);

    request[COGNITO_USER_CONTEXT_PROPERTY] = user;

    return this.validatorService.validate(
      request[COGNITO_USER_CONTEXT_PROPERTY],
    );
  }

  /**
   * Get the request from the execution context
   * @param {ExecutionContext} context - The execution context
   * @returns {Request} - The request
   */
  public abstract getRequest(context: ExecutionContext): any;

  /**
   * Get the authenticated user from the request
   * @param {Request} request - The request
   * @returns {User} - The user
   * @throws {UnauthorizedException} - If the user is not found
   */
  public getAuthenticatedUser(request): User {
    const user = request[COGNITO_USER_CONTEXT_PROPERTY];

    if (!Boolean(user)) {
      throw new UnauthorizedException('User is not authenticated.');
    }

    return request[COGNITO_USER_CONTEXT_PROPERTY];
  }

  /**
   * Get the authorization token from the request
   * @param {Request} request - The request
   * @returns {string} - The authorization token
   * @throws {UnauthorizedException} - If the authorization token is not found
   */
  private getAuthorizationToken(request): string {
    if (!Boolean(request)) {
      throw new ServiceUnavailableException('Request is undefined or null.');
    }
    const { authorization } = request?.headers;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    return authorization.replace('Bearer ', '');
  }
}
