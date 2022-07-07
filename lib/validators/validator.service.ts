import { Injectable } from '@nestjs/common';
import { AuthenticationValidator } from '../authentication/authentication.validator';
import { AuthorizationOptions } from '../authorization/authorization.options';
import { AuthorizationValidator } from '../authorization/authorization.validator';
import { User } from '../user/user.model';
import { AbstractValidator } from './abstract.validator';

@Injectable()
export class ValidatorService {
  /**
   * Validates the user against the given options.
   * @param user The user to validate.
   * @param options The options to validate the user against.
   * @returns True if the user has valid roles, false otherwise.
   */
  public validate(user: User, options?: AuthorizationOptions): any {
    return this.getValidator(options).validate(user, options);
  }

  /**
   * Gets the validator to use.
   * @param options The options to get the validator from.
   * @returns The validator to use.
   */
  private getValidator(options?: AuthorizationOptions): AbstractValidator {
    return Boolean(options)
      ? AuthorizationValidator.useFactory(options)
      : AuthenticationValidator.useFactory();
  }
}
