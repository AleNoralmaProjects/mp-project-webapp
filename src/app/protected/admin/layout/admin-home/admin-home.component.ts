import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent {
  get user_auth_info() {
    return this.authService.currentlyUser();
  }

  isExpanded: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  closeSesion() {
    this.authService.logOut();
    this.router.navigateByUrl('auth');
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
