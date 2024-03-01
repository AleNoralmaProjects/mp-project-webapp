import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedRoutingModule } from './protected-routing.module';
import { StatusManagementPipe } from './pipes/status-management.pipe';
import { FilterBrigadeeaisPipe } from './pipes/filter-brigadeeais.pipe';
import { FilterProfessionalPipe } from './pipes/filter-professional.pipe';
import { NullPipe } from './pipes/null.pipe';

@NgModule({
  declarations: [
    StatusManagementPipe,
    FilterBrigadeeaisPipe,
    FilterProfessionalPipe,
    NullPipe,
  ],
  imports: [CommonModule, ProtectedRoutingModule],
  exports: [
    StatusManagementPipe,
    FilterBrigadeeaisPipe,
    FilterProfessionalPipe,
    NullPipe,
  ],
})
export class ProtectedModule {}
