import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EaisRoutingModule } from './eais-routing.module';
import { EaisHomeComponent } from './layout/eais-home/eais-home.component';
import { EaisProfileComponent } from './pages/eais-profile/eais-profile.component';
import { EaisInformationComponent } from './pages/eais-information/eais-information.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RoutesEaisComponent } from './pages/routes-eais/routes-eais.component';
import { NullPipe } from '../pipes/null.pipe';
import { ProtectedModule } from '../protected.module';

@NgModule({
  declarations: [
    EaisHomeComponent,
    EaisProfileComponent,
    EaisInformationComponent,
    RoutesEaisComponent,
  ],
  imports: [
    CommonModule,
    EaisRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ProtectedModule,
  ],
})
export class EaisModule {}
