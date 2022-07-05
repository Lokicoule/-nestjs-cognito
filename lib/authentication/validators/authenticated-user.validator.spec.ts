import { AuthenticatedUserValidator } from './authenticated-user.validator';
import { User } from '../../user/user.model';
describe('AuthenticatedUserValidator', () => {
  it('should be truthy', () => {
    const validator = new AuthenticatedUserValidator();
    const user: User = new User('username', 'email');

    expect(validator.validate(user)).toBeTruthy();
  });
});
