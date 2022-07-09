import { AllowedGroupsValidator } from './allowed-groups.validator';
import { User } from '../../user/user.model';
import { UserBuilder } from '../../user/user.builder';

describe('AllowedGroupsValidator', () => {
  it('should be truthy, user has Admin group', () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername('username')
      .setEmail('email')
      .setGroups(['Admin', 'User'])
      .build();

    const options = {
      allowedGroups: ['Admin'],
    };
    expect(allowedGroupsValidator.validate(user, options)).toBeTruthy();
  });

  it("should be falsy, user doesn't have Admin group", () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername('username')
      .setEmail('email')
      .setGroups(['Moderator', 'User'])
      .build();

    const options = {
      allowedGroups: ['Admin'],
    };
    expect(allowedGroupsValidator.validate(user, options)).toBeFalsy();
  });

  it('should be truthy, allowedGroups option is implicit', () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername('username')
      .setEmail('email')
      .setGroups(['Moderator', 'User'])
      .build();

    expect(allowedGroupsValidator.validate(user, ['User'])).toBeTruthy();
  });

  it('should be truthy, allowedGroups option is empty', () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername('username')
      .setEmail('email')
      .build();

    expect(allowedGroupsValidator.validate(user, {})).toBeTruthy();
  });
});
