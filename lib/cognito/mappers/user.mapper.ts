import { GetUserResponse } from '@aws-sdk/client-cognito-identity-provider';
import { UserBuilder } from '../../user/user.builder';
import { GroupsMapper } from './groups.mapper';
import { User } from '../../user/user.model';

export class UserMapper {
  /**
   * Map Cognito user to user.
   * @param {GetUserResponse} user
   * @param {null | Record<string, any> | string} payload
   * @returns {User}
   */
  public static fromGetUserAndDecodedJwt(
    user: GetUserResponse,
    payload: null | Record<string, any> | string,
  ): User {
    return this.builderFromGetUser(user)
      .setGroups(GroupsMapper.fromDecodedJwt(payload))
      .build();
  }

  /**
   * Create a user builder from a Cognito user.
   * @param {GetUserResponse} user
   * @returns {UserBuilder}
   */
  private static builderFromGetUser(user: GetUserResponse) {
    const { UserAttributes, Username } = user;
    console.log('UserAttributes', JSON.stringify(UserAttributes));
    const email = UserAttributes.find(
      (attribute: any) => attribute.Name === 'email',
    )?.Value;
    return new UserBuilder().setUsername(Username).setEmail(email);
  }
}
