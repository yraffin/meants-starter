import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { GmapsComponent } from './gmaps/gmaps.component';
import { AdminDashboardGuard } from './admin-dashboard-guard';
@NgModule({
  imports: [
    SharedModule,
    AgmCoreModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    GmapsComponent
  ],
  providers: [AdminDashboardGuard]
})
export class AdminModule { }
