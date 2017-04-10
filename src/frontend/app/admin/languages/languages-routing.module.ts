import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TranslateResolver } from '../../core/translate-resolver';
import { LanguagesComponent } from './languages.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ResourcesComponent } from './resources/resources.component';
import * as Guards from './guards';

const routes: Routes = [
  {
    path: '', canActivate: [Guards.LanguagesGuard],
    data: {
      code: 'admin.menu.languages.title'
    },
    resolve: {
      title: TranslateResolver
    },
    children: [
      {
        path: '', component: LanguagesComponent,
        data: {
          code: 'admin.menu.languages.list'
        },
        resolve: {
          title: TranslateResolver
        }
      },
      {
        path: 'new', component: CreateComponent, canActivate: [Guards.LanguagesCreateGuard],
        data: {
          code: 'admin.menu.languages.create'
        },
        resolve: {
          title: TranslateResolver
        }
      },
      {
        path: ':id/update', component: EditComponent, canActivate: [Guards.LanguagesUpdateGuard],
        data: {
          code: 'admin.menu.languages.update'
        },
        resolve: {
          title: TranslateResolver
        }
      },
      {
        path: ':id/resources', component: ResourcesComponent, canActivate: [Guards.LanguagesUpdateGuard],
        data: {
          code: 'admin.menu.languages.resources'
        },
        resolve: {
          title: TranslateResolver
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
export class LanguagesRoutingModule { }
