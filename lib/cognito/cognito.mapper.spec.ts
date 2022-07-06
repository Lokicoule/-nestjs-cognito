import { User } from '../user/user.model';
import { CognitoMapper } from './cognito.mapper';

describe('CognitoMapper', () => {
  describe('fromGetUserResponse', () => {
    it('should return a valid User', () => {
      const user = CognitoMapper.mapUserFromGetUserResponse({
        UserAttributes: [{ Name: 'email', Value: 'test@email.com' }],
        Username: 'test',
      });
      expect(user).toBeTruthy();
      expect(user.username).toBe('test');
      expect(user.email).toBe('test@email.com');
      expect(user.groups).toBeUndefined();
    });

    it('should return a valid User with groups', () => {
      const user = CognitoMapper.mapUserFromGetUserResponse({
        UserAttributes: [{ Name: 'email', Value: 'test@email.com' }],
        Username: 'test',
      });
      expect(user).toBeTruthy();
      expect(user.username).toBe('test');
      expect(user.email).toBe('test@email.com');
      expect(user.groups).toBeUndefined();
      user.groups = ['test', 'test2'];
      expect(user.groups).toEqual(['test', 'test2']);
    });

    it('should return a valid User with no group', () => {
      const user = CognitoMapper.mapUserFromGetUserResponse({
        UserAttributes: [{ Name: 'email', Value: 'test@email.com' }],
        Username: 'test',
      });
      expect(user).toBeTruthy();
      expect(user.username).toBe('test');
      expect(user.email).toBe('test@email.com');
      expect(user.groups).toBeUndefined();
    });
  });

  describe('mapUserGroupsFromAdminListGroupsForUserResponse', () => {
    it('should return a valid User', () => {
      const user =
        CognitoMapper.mapUserGroupsFromAdminListGroupsForUserResponse({
          Groups: [{ GroupName: 'test' }, { GroupName: 'test2' }],
        });
      expect(user).toBeTruthy();
      expect(user).toEqual(['test', 'test2']);
    });

    it('should return a valid User with no group', () => {
      const user =
        CognitoMapper.mapUserGroupsFromAdminListGroupsForUserResponse({
          Groups: [],
        });
      expect(user).toBeTruthy();
      expect(user).toEqual([]);
    });
  });
});
