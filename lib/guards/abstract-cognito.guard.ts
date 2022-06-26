import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { COGNITO_USER_CONTEXT_PROPERTY } from '../constants/cognito.constants';
import { CognitoUser } from '../models/cognito-user.model';
import { CognitoService } from '../services/cognito.service';

@Injectable()
export abstract class AbstractCognitoGuard implements CanActivate {
  constructor(private readonly cognitoService: CognitoService) {}

  /**
   * Check if the user is authenticated
   * @param {Request} request - The request
   * @returns {Promise<boolean>} - True or false if the user is authenticated or not
   * @memberof AbstractCognitoGuard
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const authorization = this.getAuthorizationToken(request);
    const user: CognitoUser = await this.cognitoService.getUser(authorization);
    request[COGNITO_USER_CONTEXT_PROPERTY] = user;
    return this.getAuthenticatedUser(request) === user;
  }

  /**
   * Get the authenticated user from the request
   * @param {Request} request - The request
   * @returns {CognitoUser} - The user
   * @memberof AbstractCognitoGuard
   * @throws {UnauthorizedException} - If the user is not found
   */
  private getAuthenticatedUser(request): CognitoUser {
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
   * @memberof AbstractCognitoGuard
   * @throws {UnauthorizedException} - If the authorization token is not found
   */
  private getAuthorizationToken(request): string {
    const { authorization } = request?.headers;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing.');
    }
    return authorization;
  }

  /**
   * Get the request from the execution context
   * @param {ExecutionContext} context - The execution context
   * @returns {Request} - The request
   * @memberof AbstractCognitoGuard
   * @abstract
   */
  public abstract getRequest(context: ExecutionContext): any;
}
