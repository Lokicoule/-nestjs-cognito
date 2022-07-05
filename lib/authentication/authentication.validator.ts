import { ValidatorChainBuilder } from '../validators/validator.builder';
import { AuthenticatedUserValidator } from './validators/authenticated-user.validator';

export const AUTHENTICATION_VALIDATION = 'AUTHENTICATION_VALIDATION';

export const AuthenticationValidator = {
  AUTHENTICATION_VALIDATION: ValidatorChainBuilder.create().with(
    new AuthenticatedUserValidator(),
  ).first,
};
