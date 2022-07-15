import { CanActivate, Injectable, mixin, Type } from '@nestjs/common';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { User } from '../user/user.model';
import { memoize } from '../utils/memoize.util';
import { AuthorizationOptions } from './authorization.options';
import { AuthorizationValidator } from './authorization.validator';

const createAuthorizationGuard = (
  options: AuthorizationOptions,
): Type<CanActivate> => {
  @Injectable()
  class AuthorizationGuardMixin extends AuthenticationGuard {
    public onValidate(user: User): boolean {
      return AuthorizationValidator.useFactory(options).validate(user, options);
    }
  }

  return mixin(AuthorizationGuardMixin);
};

export const AuthorizationGuard: (
  options: AuthorizationOptions,
) => Type<CanActivate> = memoize(createAuthorizationGuard);
