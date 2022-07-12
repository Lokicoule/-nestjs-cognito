import { AuthorizationOptions } from '../../authorization/authorization.options';
import { User } from '../../user/user.model';
import { AbstractValidator } from '../../validators/abstract.validator';

export class AuthenticatedUserValidator extends AbstractValidator {
  public validate(user?: User, options?: AuthorizationOptions): boolean {
    if (!Boolean(user)) {
      return false;
    }
    return super.validate(user, options);
  }
}
