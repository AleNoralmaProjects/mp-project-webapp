import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EaisRoutingModule } from './eais-routing.module';
import { EaisHomeComponent } from './layout/eais-home/eais-home.component';
import { EaisProfileComponent } from './pages/eais-profile/eais-profile.component';


@NgModule({
  declarations: [
    EaisHomeComponent,
    EaisProfileComponent
  ],
  imports: [
    CommonModule,
    EaisRoutingModule
  ]
})
export class EaisModule { }
