import { User } from '../../user/user.model';
import { ProhibitedGroupsValidator } from './prohibited-groups.validator';

describe('ProhibitedGroupsValidator', () => {
  it("should be truthy, user doesn't have Admin group", () => {
    const prohibitedGroupsValidator = new ProhibitedGroupsValidator();
    const user: User = new User('username', 'email');
    user.addGroupsFromAdminListGroupsForUserResponse({
      Groups: [{ GroupName: 'Moderator' }, { GroupName: 'User' }],
    });
    const options = {
      prohibitedGroups: ['Admin'],
    };
    expect(prohibitedGroupsValidator.validate(user, options)).toBeTruthy();
  });
  it('should be falsy, user has Admin group', () => {
    const prohibitedGroupsValidator = new ProhibitedGroupsValidator();
    const user: User = new User('username', 'email');
    user.addGroupsFromAdminListGroupsForUserResponse({
      Groups: [{ GroupName: 'Admin' }, { GroupName: 'User' }],
    });
    const options = {
      prohibitedGroups: ['Admin'],
    };
    expect(prohibitedGroupsValidator.validate(user, options)).toBeFalsy();
  });

  it('should be truthy, prohibitedGroups option is empty', () => {
    const prohibitedGroupsValidator = new ProhibitedGroupsValidator();
    const user: User = new User('username', 'email');
    user.addGroupsFromAdminListGroupsForUserResponse({
      Groups: [{ GroupName: 'Moderator' }, { GroupName: 'User' }],
    });
    expect(prohibitedGroupsValidator.validate(user, {})).toBeTruthy();
  });
});