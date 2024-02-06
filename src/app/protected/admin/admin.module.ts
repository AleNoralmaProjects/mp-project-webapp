import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './layout/admin-home/admin-home.component';
import { ViewMapComponent } from './pages/view-map/view-map.component';
import { BrigadaEaisComponent } from './pages/brigada-eais/brigada-eais.component';
import { ManageProfessionalComponent } from './pages/manage-professional/manage-professional.component';
import { ManageProfessionComponent } from './pages/manage-profession/manage-profession.component';
import { ManageInfoeaisComponent } from './pages/manage-infoeais/manage-infoeais.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProtectedModule } from '../protected.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AdminHomeComponent,
    ViewMapComponent,
    BrigadaEaisComponent,
    ManageProfessionalComponent,
    ManageProfessionComponent,
    ManageInfoeaisComponent,
    AdminProfileComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProtectedModule,
    NgxPaginationModule,
    SharedModule,
    NgSelectModule
  ],
})
export class AdminModule {}
