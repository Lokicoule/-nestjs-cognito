import { AuthorizationOptions } from '../authorization/authorization.options';
import { User } from '../user/user.model';

interface Validator {
  setNext(validator: Validator): Validator;
  validate(user: User, options?: AuthorizationOptions): boolean;
}

export abstract class AbstractValidator implements Validator {
  private _nextValidator: Validator;

  /**
   * @param {Validator} nextValidator - The next validator in the chain
   * @returns {Validator} - The next validator in the chain
   */
  public setNext(validator: Validator): Validator {
    this._nextValidator = validator;
    return validator;
  }

  /**
   * @param {User} user - The user to validate
   * @param {AuthorizationOptions} [options] - The options to validate the user with
   * @returns {boolean} - The result of the validation process (true if the user is valid)
   */
  public validate(user?: User, options?: AuthorizationOptions): boolean {
    return Boolean(this._nextValidator)
      ? this._nextValidator.validate(user, options)
      : true;
  }
}
