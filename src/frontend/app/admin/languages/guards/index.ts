import { LanguagesGuard } from './languages-guard';
import { LanguagesCreateGuard } from './languages-create-guard';
import { LanguagesUpdateGuard } from './languages-update-guard';
import { LanguagesDeleteGuard } from './languages-delete-guard';

export const USERS_GUARD_PROVIDERS = [
  LanguagesGuard,
  LanguagesCreateGuard,
  LanguagesUpdateGuard,
  LanguagesDeleteGuard
];

export {
  LanguagesGuard,
  LanguagesCreateGuard,
  LanguagesUpdateGuard,
  LanguagesDeleteGuard
};
