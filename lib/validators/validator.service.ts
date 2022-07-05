import { Injectable } from '@nestjs/common';
import {
  AuthenticationValidator,
  AUTHENTICATION_VALIDATION,
} from '../authentication/authentication.validator';
import { AuthorizationOptions } from '../authorization/authorization.options';
import {
  AuthorizationValidator,
  AUTHORIZATION_VALIDATION,
} from '../authorization/authorization.validator';
import { User } from '../user/user.model';
import { AbstractValidator } from './abstract.validator';

@Injectable()
export class ValidatorService {
  private _validators: Record<string, AbstractValidator>;

  constructor() {
    this._validators = {
      ...AuthenticationValidator,
      ...AuthorizationValidator,
    };
  }

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
    return this._validators[
      Boolean(options) ? AUTHORIZATION_VALIDATION : AUTHENTICATION_VALIDATION
    ];
  }
}
