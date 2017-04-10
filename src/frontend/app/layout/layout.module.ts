import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { LandingLayoutComponent } from './landing-layout/landing-layout.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    AdminLayoutComponent,
    LandingLayoutComponent
  ],
  exports: [
    AdminLayoutComponent,
    LandingLayoutComponent
  ]
})
export class LayoutModule { }
