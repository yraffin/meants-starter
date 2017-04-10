import { UserModel } from './user-model';

/**
 * Represents the user model.
 * @class
 */
export class RegisterModel extends UserModel {
    /** Gets or sets the username @property {string} */
    username: string;
    /** Gets or sets the password @property {string} */
    password: string;
    /** Gets or sets the passwordConfirm @property {string} */
    passwordConfirm: string;
}
