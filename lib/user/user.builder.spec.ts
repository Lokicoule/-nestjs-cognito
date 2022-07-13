import { UserBuilder } from './user.builder';
import { User } from './user.model';

describe('UserBuilder', () => {
  describe('groups', () => {
    it('should return a lower case group', () => {
      const user: User = new UserBuilder()
        .setUsername('username')
        .setEmail('email')
        .setGroups(['Admin', 'User'])
        .build();
      expect(user.groups).toEqual(['admin', 'user']);
    });

    it('should return empty groups ', () => {
      const user: User = new UserBuilder().setUsername('username').build();
      expect(user.username).toEqual('username');
      expect(user.email).toEqual(undefined);
      expect(user.groups).toBeUndefined();
    });
  });
});
