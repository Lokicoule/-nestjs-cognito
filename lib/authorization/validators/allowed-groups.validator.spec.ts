import { AllowedGroupsValidator } from './allowed-groups.validator';
import { User } from '../../user/user.model';

describe('AllowedGroupsValidator', () => {
  it('should be truthy, user has Admin group', () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new User('username', 'email');
    user.groups = ['admin', 'user'];
    const options = {
      allowedGroups: ['Admin'],
    };
    expect(allowedGroupsValidator.validate(user, options)).toBeTruthy();
  });

  it("should be falsy, user doesn't have Admin group", () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new User('username', 'email');
    user.groups = ['Moderator', 'user'];

    const options = {
      allowedGroups: ['Admin'],
    };
    expect(allowedGroupsValidator.validate(user, options)).toBeFalsy();
  });

  it('should be truthy, allowedGroups option is implicit', () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new User('username', 'email');
    user.groups = ['Moderator', 'user'];

    expect(allowedGroupsValidator.validate(user, ['User'])).toBeTruthy();
  });

  it('should be truthy, allowedGroups option is empty', () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new User('username', 'email');

    expect(allowedGroupsValidator.validate(user, {})).toBeTruthy();
  });
});
