import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/user.model';
import { ValidatorService } from './validator.service';

describe('ValidatorService', () => {
  let service: ValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidatorService],
    }).compile();

    service = module.get<ValidatorService>(ValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should be defined', () => {
      expect(service.validate).toBeDefined();
    });

    it('should be truthy, there is no options', () => {
      const user: User = new User('username', 'email');

      expect(service.validate(user)).toBeTruthy();
    });

    it('should be truthy, user has allowed groups', () => {
      const user: User = new User('username', 'email');
      user.addGroupsFromAdminListGroupsForUserResponse({
        Groups: [{ GroupName: 'Admin' }, { GroupName: 'User' }],
      });
      const options = {
        allowedGroups: ['admin'],
      };
      expect(service.validate(user, options)).toBeTruthy();
    });

    it('should be truthy, user has implicit allowed groups', () => {
      const user: User = new User('username', 'email');
      user.addGroupsFromAdminListGroupsForUserResponse({
        Groups: [{ GroupName: 'Admin' }, { GroupName: 'User' }],
      });
      expect(service.validate(user, ['User'])).toBeTruthy();
      expect(service.validate(user, ['Admin'])).toBeTruthy();
    });

    it("should be truthy, user doesn't have prohibited groups and has allowed groups", () => {
      const user: User = new User('username', 'email');
      user.addGroupsFromAdminListGroupsForUserResponse({
        Groups: [{ GroupName: 'Admin' }, { GroupName: 'Moderator' }],
      });
      const options = {
        allowedGroups: ['Admin'],
        prohibitedGroups: ['User'],
      };
      expect(service.validate(user, options)).toBeTruthy();
    });

    it('should be truthy, user has required groups', () => {
      const user: User = new User('username', 'email');
      user.addGroupsFromAdminListGroupsForUserResponse({
        Groups: [
          { GroupName: 'Admin' },
          { GroupName: 'User' },
          { GroupName: 'Moderator' },
        ],
      });
      const options = {
        requiredGroups: ['Admin', 'User'],
        allowedGroups: ['Moderator'],
      };
      expect(service.validate(user, options)).toBeTruthy();
    });

    it("should be falsy, user doesn't have required groups", () => {
      const user: User = new User('username', 'email');
      user.addGroupsFromAdminListGroupsForUserResponse({
        Groups: [{ GroupName: 'Moderator' }, { GroupName: 'User' }],
      });
      const options = {
        requiredGroups: ['Admin'],
        allowedGroups: ['Admin', 'Moderator'],
      };
      expect(service.validate(user, options)).toBeFalsy();
    });

    it('should be falsy, user has prohibited group', () => {
      const user: User = new User('username', 'email');
      user.addGroupsFromAdminListGroupsForUserResponse({
        Groups: [{ GroupName: 'Admin' }, { GroupName: 'User' }],
      });
      const options = {
        prohibitedGroups: ['Admin'],
      };
      expect(service.validate(user, options)).toBeFalsy();
    });

    it("should be truthy, user doesn't have prohibited group", () => {
      const user: User = new User('username', 'email');
      user.addGroupsFromAdminListGroupsForUserResponse({
        Groups: [{ GroupName: 'Admin' }, { GroupName: 'User' }],
      });
      const options = {
        prohibitedGroups: ['Moderator'],
      };
      expect(service.validate(user, options)).toBeTruthy();
    });
  });
});
