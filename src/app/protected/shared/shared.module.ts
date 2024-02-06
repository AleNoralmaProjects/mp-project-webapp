import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ProtectedModule } from '../protected.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, ProtectedModule, FormsModule, ReactiveFormsModule],
  exports: [UserProfileComponent],
})
export class SharedModule {}
