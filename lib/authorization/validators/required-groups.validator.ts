import { AuthorizationOptions } from '../authorization.options';
import { User } from '../../user/user.model';
import { AbstractValidator } from '../../validators/abstract.validator';

export class RequiredGroupsValidator extends AbstractValidator {
  public validate(user: User, options: AuthorizationOptions): boolean {
    const requiredGroups = Array.isArray(options)
      ? null
      : options.requiredGroups;

    if (Boolean(requiredGroups) && !user.hasAllGroups(requiredGroups)) {
      return false;
    }
    return super.validate(user, options);
  }
}
