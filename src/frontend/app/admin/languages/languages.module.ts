import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguagesComponent } from './languages.component';
import { LanguagesService } from './languages.service';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { CreateOrUpdateComponent } from './create-or-update/create-or-update.component';
import { USERS_GUARD_PROVIDERS } from './guards';
import { ResourcesComponent } from './resources/resources.component';

@NgModule({
  imports: [
    SharedModule,
    LanguagesRoutingModule
  ],
  declarations: [
    LanguagesComponent,
    CreateComponent,
    EditComponent,
    CreateOrUpdateComponent,
    ResourcesComponent
  ],
  providers: [
    LanguagesService,
    USERS_GUARD_PROVIDERS
  ]
})
export class LanguagesModule { }
