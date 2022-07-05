import { User } from './user.model';

describe('User', () => {
  it('should return a valid User', () => {
    const user = User.fromGetUserResponse({
      UserAttributes: [{ Name: 'email', Value: 'test@email.com' }],
      Username: 'test',
    });
    expect(user).toBeTruthy();
    expect(user.username).toBe('test');
    expect(user.email).toBe('test@email.com');
    expect(user.groups).toBeUndefined();
  });

  it('should return a valid User with groups', () => {
    const user = User.fromGetUserResponse({
      UserAttributes: [{ Name: 'email', Value: 'test@email.com' }],
      Username: 'test',
    });
    expect(user).toBeTruthy();
    expect(user.username).toBe('test');
    expect(user.email).toBe('test@email.com');
    expect(user.groups).toBeUndefined();
    user.addGroupsFromAdminListGroupsForUserResponse({
      Groups: [{ GroupName: 'test' }, { GroupName: 'test2' }],
    });
    expect(user.groups).toEqual(['test', 'test2']);
  });

  it('should return a valid User with no group', () => {
    const user = User.fromGetUserResponse({
      UserAttributes: [{ Name: 'email', Value: 'test@email.com' }],
      Username: 'test',
    });
    expect(user).toBeTruthy();
    expect(user.username).toBe('test');
    expect(user.email).toBe('test@email.com');
    expect(user.groups).toBeUndefined();
    user.addGroupsFromAdminListGroupsForUserResponse({
      Groups: [],
    });
    expect(user.groups).toEqual([]);
  });
});
