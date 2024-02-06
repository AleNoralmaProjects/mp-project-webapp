import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { Report } from 'notiflix';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  myLoginForm: FormGroup = this.fb.group({
    user: ['', [Validators.required, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get user_auth_info() {
    return this.authService.currentlyUser;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  /* Funcion  Login */
  login() {
    console.log('Has hecho clic');
    const { user, password } = this.myLoginForm.value;
    this.authService.loginConection(user, password).subscribe({
      next: (response) => {
        console.log(response);
        const rol = this.user_auth_info()?.role.toLowerCase();
        this.router.navigateByUrl(`/protectedroute/${rol}/pages/home`);
      },
      error: (err) => {
        console.log(err.error);
        Report.failure('No autorizado', err.message, 'Regresar');
      },
    });
  }

  uuidValidateV4(uuid: string) {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
  }
}
