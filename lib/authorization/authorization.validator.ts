import { ValidatorChainBuilder } from '../validators/validator.builder';
import { AllowedGroupsValidator } from './validators/allowed-groups.validator';
import { ProhibitedGroupsValidator } from './validators/prohibited-groups.validator';
import { RequiredGroupsValidator } from './validators/required-groups.validator';

export const AUTHORIZATION_VALIDATION = 'AUTHORIZATION_VALIDATION';

export const AuthorizationValidator = {
  AUTHORIZATION_VALIDATION: ValidatorChainBuilder.create()
    .with(new AllowedGroupsValidator())
    .with(new ProhibitedGroupsValidator())
    .with(new RequiredGroupsValidator()).first,
};
