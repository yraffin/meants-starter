import { UsersGuard } from './users-guard';
import { UsersCreateGuard } from './users-create-guard';
import { UsersUpdateGuard } from './users-update-guard';
import { UsersDeleteGuard } from './users-delete-guard';

export const USERS_GUARD_PROVIDERS = [
  UsersGuard,
  UsersCreateGuard,
  UsersUpdateGuard,
  UsersDeleteGuard
];

export {
  UsersGuard,
  UsersCreateGuard,
  UsersUpdateGuard,
  UsersDeleteGuard
};
