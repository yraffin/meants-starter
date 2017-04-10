import { AuthorizationGuard } from './authorization-guard';
import { AuthorizationChildGuard } from './authorization-child-guard';
import { AuthorizationGuardService } from './authorization-guard.service';

export const USERS_GUARD_PROVIDERS = [
  AuthorizationGuard,
  AuthorizationChildGuard,
  AuthorizationGuardService
];

export {
  AuthorizationGuard,
  AuthorizationChildGuard,
  AuthorizationGuardService
};
