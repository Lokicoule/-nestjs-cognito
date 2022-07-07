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
   * Set the groups of the user and lowercase them to make them case insensitive
   * @param {string[]} groups - The groups
   */
  public set groups(groups: string[]) {
    this._groups = groups.map((group) => group.toLowerCase());
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
}
