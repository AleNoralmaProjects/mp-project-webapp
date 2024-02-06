import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { FichaFamiliarService } from 'src/app/protected/apiservice/ficha-familiar.service';

@Component({
  selector: 'app-eais-home',
  templateUrl: './eais-home.component.html',
  styleUrls: ['./eais-home.component.css'],
})
export class EaisHomeComponent {
  get user_auth_info() {
    return this.authService.currentlyUser();
  }

  isExpanded: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _fichaFamiliarService: FichaFamiliarService
  ) {}

  closeSesion() {
    this.authService.logOut();
    this.router.navigateByUrl('auth');
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
