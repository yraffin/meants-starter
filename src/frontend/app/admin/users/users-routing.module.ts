import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TranslateResolver } from '../../core/translate-resolver';
import { UsersComponent } from './users.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { RightsComponent } from './rights/rights.component';
import * as Guards from './guards';
import { UserTranslateResolver } from './user-translate-resolver';
import { UsernameResolver } from './username-resolver';

const routes: Routes = [
  {
    path: '', canActivate: [Guards.UsersGuard],
    data: {
      code: 'admin.menu.users.title'
    },
    resolve: {
      title: TranslateResolver
    },
    children: [
      {
        path: '', component: UsersComponent,
        data: {
          code: 'admin.menu.users.list'
        },
        resolve: {
          title: TranslateResolver
        }
      },
      {
        path: 'new', component: CreateComponent, canActivate: [Guards.UsersCreateGuard],
        data: {
          code: 'admin.menu.users.create'
        },
        resolve: {
          title: TranslateResolver
        }
      },
      {
        path: ':id/update', component: EditComponent, canActivate: [Guards.UsersUpdateGuard],
        data: {
          code: 'admin.menu.users.update'
        },
        resolve: {
          title: UserTranslateResolver,
          username: UsernameResolver
        }
      },
      {
        path: ':id/rights', component: RightsComponent,
        data: {
          code: 'admin.menu.users.rights'
        },
        resolve: {
          title: UserTranslateResolver,
          username: UsernameResolver
        }
      },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule { }
