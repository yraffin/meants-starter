import { NgModule } from '@angular/core';
import * as _ from 'underscore';

import { SharedModule } from '../../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { CreateOrUpdateComponent } from './create-or-update/create-or-update.component';
import { RightsComponent } from './rights/rights.component';
import { USERS_GUARD_PROVIDERS } from './guards';
import { UserTranslateResolver } from './user-translate-resolver';
import { UsernameResolver } from './username-resolver';
import { UserResolverService } from './user-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  declarations: [
    UsersComponent,
    CreateComponent,
    EditComponent,
    CreateOrUpdateComponent,
    RightsComponent
  ],
  providers: [
    UsersService,
    USERS_GUARD_PROVIDERS,
    UserResolverService,
    UsernameResolver,
    UserTranslateResolver
  ]
})
export class UsersModule { }
