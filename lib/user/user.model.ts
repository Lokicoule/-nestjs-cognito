import {
  AdminListGroupsForUserResponse,
  AttributeType,
  GetUserResponse,
} from '@aws-sdk/client-cognito-identity-provider';

export class User {
  private _groups: string[];

  /**
   * Create a User
   * @param {string} username - The username
   * @param {string} email - The email address
   * @memberof User
   */
  constructor(
    private readonly _username: string,
    private readonly _email: string,
  ) {}

  /**
   * Get the username of the user
   * @returns {string} - The username
   * @memberof User
   */
  public get username(): string {
    return this._username;
  }

  /**
   * Get the email address of the user
   * @returns {string} - The email address
   * @memberof User
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Get the groups of the user
   * @returns {string[]} - The groups
   * @memberof User
   */
  public get groups(): string[] {
    return this._groups;
  }

  /**
   * Check if the user has a group
   * @param {string} group - The group
   * @returns {boolean} - True if the user has the group
   * @memberof User
   */
  public hasGroup(group: string): boolean {
    return this._groups?.includes(group.toLowerCase());
  }

  /**
   * Check if the user has at least one of the required groups
   * @param {string[]} groups - The required groups
   * @returns {boolean} - True if the user has at least one of the required groups
   * @memberof User
   */
  public hasSomeGroup(groups: string[] = []): boolean {
    return groups.some((group) => this.hasGroup(group));
  }

  /**
   * Check if the user has the required groups
   * @param {string[]} groups - The required groups
   * @returns {boolean} - True if the user has the required groups
   * @memberof User
   */
  public hasAllGroups(groups: string[] = []): boolean {
    return groups.every((group) => this.hasGroup(group));
  }

  /**
   * Add groups to the user
   * @param {AdminListGroupsForUserResponse} response - The response from AdminListGroupsForUser
   * @memberof User
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminListGroupsForUser.html
   */
  public addGroupsFromAdminListGroupsForUserResponse(
    adminListGroupsForUserResponse: AdminListGroupsForUserResponse,
  ): void {
    if (Boolean(adminListGroupsForUserResponse.Groups)) {
      this._groups = adminListGroupsForUserResponse.Groups.map((group) =>
        group.GroupName.toLowerCase(),
      );
    }
  }

  /**
   * Create a User from a GetUserResponse
   * @static
   * @param {GetUserResponse} response - The response from GetUser
   * @returns {User} - The user
   * @memberof User
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_ResponseElements_UserAttributes
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_ResponseElements_UserAttributes_AttributeType
   */
  public static fromGetUserResponse(user: GetUserResponse): User {
    const { Username, UserAttributes } = user;
    const email = UserAttributes.find(
      (attribute: AttributeType) => attribute.Name === 'email',
    )?.Value;
    return new User(Username, email);
  }
}
