import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { StatusManagementPipe } from './pipes/status-management.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterBrigadeeaisPipe } from './pipes/filter-brigadeeais.pipe';
import { FilterProfessionalPipe } from './pipes/filter-professional.pipe';

@NgModule({
  declarations: [
    StatusManagementPipe,
    FilterBrigadeeaisPipe,
    FilterProfessionalPipe,
  ],
  imports: [CommonModule, ProtectedRoutingModule],
  exports: [
    StatusManagementPipe,
    FilterBrigadeeaisPipe,
    FilterProfessionalPipe,
  ],
})
export class ProtectedModule {}
