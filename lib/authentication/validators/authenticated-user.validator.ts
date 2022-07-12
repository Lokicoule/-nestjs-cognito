import { AuthorizationOptions } from '../../authorization/authorization.options';
import { User } from '../../user/user.model';
import { AbstractValidator } from '../../validators/abstract.validator';

export class AuthenticatedUserValidator extends AbstractValidator {
  public onValidate(user?: User, options?: AuthorizationOptions): boolean {
    return Boolean(user);
  }
}
