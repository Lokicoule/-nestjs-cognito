import { UserMapper } from './user.mapper';

describe('UserMapper', () => {
  describe('fromGetUserAndDecodedJwt', () => {
    it('should return a valid User with empty groups', () => {
      const user = UserMapper.fromGetUserAndDecodedJwt(
        {
          UserAttributes: [{ Name: 'email', Value: 'test@email.com' }],
          Username: 'test',
        },
        {},
      );
      expect(user).toBeTruthy();
      expect(user.username).toBe('test');
      expect(user.email).toBe('test@email.com');
      expect(user.groups).toEqual([]);
    });

    it('should return a valid User with admin groups', () => {
      const user = UserMapper.fromGetUserAndDecodedJwt(
        {
          UserAttributes: [{ Name: 'email', Value: 'test@email.com' }],
          Username: 'test',
        },
        {
          'cognito:groups': ['admin'],
        },
      );
      expect(user).toBeTruthy();
      expect(user.username).toBe('test');
      expect(user.email).toBe('test@email.com');
      expect(user.groups).toEqual(['admin']);
    });
  });
});
