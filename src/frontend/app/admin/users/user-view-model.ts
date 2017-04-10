import { UserModel } from './user-model';

export class UserViewModel {
  /** Gets or sets the user identifier @property {string} */
  id = '';

  /** Gets or sets the user civility @property {string} */
  civility = 0;

  /** Gets or sets the user email @property {string} */
  email = '';

  /** Gets or sets the user passwordGroup @property {object} */
  passwordGroup = {
    /** Gets or sets the user password @property {string} */
    password: '',

    /** Gets or sets the user passwordConfirm @property {string} */
    passwordConfirm: '',
  };

  /** Gets or sets the user firstname @property {string} */
  firstname = '';

  /** Gets or sets the user lastname @property {string} */
  lastname = '';

  /** Gets or sets a value indicating whether user is system user. @property {boolean} */
  isSystem = false;

  /**
   * Gets a user form model from a user model.
   * @method
   * @static
   * @param {UserModel} model The user model.
   * @returns {UserViewModel}
   */
  static fromModel(model: UserModel) {
    let viewModel = Object.assign(new UserViewModel(), model);
    return viewModel as UserViewModel;
  }

  /**
   * Gets a user model from a user view model.
   * @method
   * @static
   * @param {UserViewModel} viewModel The user view model.
   * @returns {UserModel}
   */
  static toModel(viewModel: UserViewModel) {
    let model = Object.assign({}, viewModel);
    delete model.passwordGroup;

    if (viewModel.passwordGroup && viewModel.passwordGroup.password && viewModel.passwordGroup.password.length > 0) {
      model = Object.assign(model, viewModel.passwordGroup);
    }

    return model as UserModel;
  }
}
