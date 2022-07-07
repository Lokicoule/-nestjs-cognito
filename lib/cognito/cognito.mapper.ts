import {
  GetUserResponse,
  AttributeType,
  AdminListGroupsForUserResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import { User } from '../user';

export class CognitoMapper {
  /**
   * Map a User from a GetUserResponse
   * @static
   * @param {GetUserResponse} response - The response from GetUser
   * @returns {User} - The user
   * @memberof CognitoMapper
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_ResponseElements_UserAttributes
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_ResponseElements_UserAttributes_AttributeType
   */
  public static mapUserFromGetUserResponse(user: GetUserResponse): User {
    const { Username, UserAttributes } = user;
    const email = UserAttributes.find(
      (attribute: AttributeType) => attribute.Name === 'email',
    )?.Value;
    return new User(Username, email);
  }

  /**
   * Map groups from an AdminListGroupsForUserResponse
   * @static
   * @param {AdminListGroupsForUserResponse} response - The response from AdminListGroupsForUser
   * @returns {string[]} - The groups
   * @memberof CognitoMapper
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminListGroupsForUser.html
   */
  public static mapUserGroupsFromAdminListGroupsForUserResponse(
    response: AdminListGroupsForUserResponse,
  ): string[] {
    return response.Groups.map((group) => group.GroupName);
  }
}
