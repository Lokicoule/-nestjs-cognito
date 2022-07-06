import { User } from '../../user/user.model';
import { RequiredGroupsValidator } from './required-groups.validator';

describe('RequiredGroupsValidator', () => {
  it('should be truthy, user has Admin and User group', () => {
    const requiredGroupsValidator = new RequiredGroupsValidator();
    const user: User = new User('username', 'email');
    user.groups = ['admin', 'user'];

    const options = {
      requiredGroups: ['Admin', 'User'],
    };
    expect(requiredGroupsValidator.validate(user, options)).toBeTruthy();
  });

  it("should be falsy, user doesn't have User group", () => {
    const requiredGroupsValidator = new RequiredGroupsValidator();
    const user: User = new User('username', 'email');
    user.groups = ['admin', 'moderator'];

    const options = {
      requiredGroups: ['Admin', 'User'],
    };
    expect(requiredGroupsValidator.validate(user, options)).toBeFalsy();
  });

  it('should be truthy, requiredGroups option is empty', () => {
    const requiredGroupsValidator = new RequiredGroupsValidator();
    const user: User = new User('username', 'email');
    user.groups = ['moderator', 'user'];

    expect(requiredGroupsValidator.validate(user, {})).toBeTruthy();
  });
});
