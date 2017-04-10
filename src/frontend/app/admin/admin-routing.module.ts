import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TranslateResolver } from '../core/translate-resolver';
import { AdminComponent } from './admin.component';
import { GmapsComponent } from './gmaps/gmaps.component';
import { AdminDashboardGuard } from './admin-dashboard-guard';

const routes: Routes = [
  {
    path: '', canActivate: [AdminDashboardGuard],
    data: {
      code: 'admin.menu.users.title'
    },
    resolve: {
      title: TranslateResolver
    },
    children: [
      { path: '', component: AdminComponent },
      // { path: 'gmaps', component: GmapsComponent },
      { path: 'users', loadChildren: './users/users.module#UsersModule' },
      { path: 'languages', loadChildren: './languages/languages.module#LanguagesModule' },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }
