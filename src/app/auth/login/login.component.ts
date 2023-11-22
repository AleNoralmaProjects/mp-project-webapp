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
    return this.authService.user;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  /* Funcion  Login */
  loginValidation() {
    console.log('Has hecho clic');
    const { user, password } = this.myLoginForm.value;
    this.authService.loginConection(user, password).subscribe((respuesta) => {
      if (this.uuidValidateV4(respuesta)) {
        // console.log(respuesta); ver si la informacion esta transcurriendo entre campos.
        switch (this.user_auth_info.role) {
          case 'ADMINISTRADOR':
            console.log('ADMINISTRADOR');
            this.router.navigateByUrl('/protectedroute/admin/pages/home');

            break;
          case 'EAIS':
            console.log('EAIS');
            this.router.navigateByUrl('/protectedroute/eais/pages/home');
            break;
          default:
            console.log("I don't understand");
            this.router.navigateByUrl('/auth/page-not-found');
            break;
        }
      } else {
        Report.failure(
          'No autorizado',
          `${respuesta} Vuelva a intentar`,
          'Volver'
        );
      }
    });
  }

  uuidValidateV4(uuid: string) {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
  }
}
