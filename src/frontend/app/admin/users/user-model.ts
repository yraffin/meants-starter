export class UserModel {
  /** Gets or sets the user identifier @property {string} */
  id?: string;

  /** Gets or sets the user civility @property {number} */
  civility: number;

  /** Gets or sets the user email @property {string} */
  email: string;

  /** Gets or sets the user password @property {string} */
  password?: string;

  /** Gets or sets the user passwordConfirm @property {string} */
  passwordConfirm?: string;

  /** Gets or sets the user firstname @property {string} */
  firstname: string;

  /** Gets or sets the user lastname @property {string} */
  lastname: string;

  /** Gets or sets a value indicating whether user is system user. @property {boolean} */
  isSystem?: boolean;
}
