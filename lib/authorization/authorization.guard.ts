import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { User } from '../user/user.model';
import { memoize } from '../utils/memoize.util';
import { AuthorizationOptions } from './authorization.options';

export const createAuthorizationGuard = (
  options?: AuthorizationOptions,
): Type<CanActivate> => {
  @Injectable()
  class AuthorizationGuardMixin
    extends AuthenticationGuard
    implements CanActivate
  {
    /**
     * @param context - The execution context
     * @returns {boolean} - True if the user has roles which respect the options
     */
    public async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = this.getRequest(context);
      const user: User = this.getAuthenticatedUser(request);

      return this.validatorService.validate(user, options);
    }
  }

  return mixin(AuthorizationGuardMixin);
};

export const AuthorizationGuard = memoize(createAuthorizationGuard);
