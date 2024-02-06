import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/service/auth.service';
import { Router } from '@angular/router';
import { AuthStatus } from './auth/interface/auth.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'mp-project-webapp';

  private authService = inject(AuthService);
  private router = inject(Router);

  get user_auth_info() {
    return this.authService.currentlyUser;
  }

  public finishedAuthStatus = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }
    return true;
  });

  public authStatusChange = effect(() => {
    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        return;
      case AuthStatus.nonAuthenticacion:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });
}
