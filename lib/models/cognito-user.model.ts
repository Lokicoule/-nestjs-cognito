import {
  AttributeType,
  GetUserResponse,
} from '@aws-sdk/client-cognito-identity-provider';

export class CognitoUser {
  /**
   * Create a CognitoUser
   * @param {string} username - The username
   * @param {string} email - The email address
   * @memberof CognitoUser
   */
  constructor(
    private readonly _username: string,
    private readonly _email: string,
  ) {}

  /**
   * Get the username of the user
   * @returns {string} - The username
   * @memberof CognitoUser
   */
  public get username(): string {
    return this._username;
  }

  /**
   * Get the email address of the user
   * @returns {string} - The email address
   * @memberof CognitoUser
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Create a CognitoUser from a GetUserResponse
   * @static
   * @param {GetUserResponse} response - The response from GetUser
   * @returns {CognitoUser} - The user
   * @memberof CognitoUser
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_ResponseElements_UserAttributes
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_GetUser.html#API_GetUser_ResponseElements_UserAttributes_AttributeType
   */
  public static fromGetUserResponse(
    user: GetUserResponse,
  ): CognitoUser | PromiseLike<CognitoUser> {
    const { Username, UserAttributes } = user;
    const email = UserAttributes.find(
      (attribute: AttributeType) => attribute.Name === 'email',
    )?.Value;
    return new CognitoUser(Username, email);
  }
}
