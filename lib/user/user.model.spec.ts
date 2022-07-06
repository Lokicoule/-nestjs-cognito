import { User } from './user.model';

describe('User', () => {
  describe('groups', () => {
    it('should return a lower case group', () => {
      const user = new User('username', 'email');
      user.groups = ['TEST'];
      expect(user.groups).toEqual(['test']);
    });

    it('should return lower case groups', () => {
      const user = new User('username', 'email');
      user.groups = ['TEST', 'TEST2'];
      expect(user.groups).toEqual(['test', 'test2']);
    });

    it('should return empty groups', () => {
      const user = new User('username', 'email');
      user.groups = [];
      expect(user.groups).toEqual([]);
    });
  });
});
