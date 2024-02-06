import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { ProfessionalService } from 'src/app/protected/apiservice/professional.service';
import {
  Profesion,
  Profesional,
} from 'src/app/protected/prointerfaces/api.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirm, Notify, Report } from 'notiflix';
import { ProfessionService } from 'src/app/protected/apiservice/profession.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  get user_auth_info() {
    return this.authService.currentlyUser();
  }

  userProfession: Profesion = Object.create([]);
  professionalInformation: Profesional = Object.create([]);

  user_password = {
    password: '',
  };

  passwordRepeat: string = '';
  showUserModal: boolean = false;
  showPasswordModal: boolean = false;
  showPersonalModal: boolean = false;

  list_professions: Profesion[] = [];

  updatePersonalInfoFrom: FormGroup = this.fb.group({
    profesion: ['', [Validators.required]],
    telefono: [
      '',
      [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.maxLength(20),
      ],
    ],
  });

  updateUserFrom: FormGroup = this.fb.group({
    user: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
    ],
  });

  constructor(
    private authService: AuthService,
    private professionalService: ProfessionalService,
    private fb: FormBuilder,
    private professionService: ProfessionService
  ) {}

  ngOnInit(): void {
    console.log(this.user_auth_info);
    if (this.user_auth_info?.id_Profesional) {
      this.professionalService
        .shearchProfessionalinApi(this.user_auth_info.id_Profesional)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.professionalInformation = response;
            this.userProfession = response.profesion;
            this.updatePersonalInfoFrom
              .get('profesion')
              ?.setValue(this.userProfession.id_profesion);
            this.updatePersonalInfoFrom
              .get('telefono')
              ?.setValue(this.professionalInformation.telefono);
            this.updateUserFrom
              .get('user')
              ?.setValue(this.professionalInformation.user);
          },
          error: (err) => {
            console.log(err.error);
          },
        });
    }
  }

  toggleUserModal() {
    this.showUserModal = !this.showUserModal;
  }

  togglePasswordModal() {
    this.showPasswordModal = !this.showPasswordModal;
  }

  togglePasswordModalClose() {
    this.user_password.password = '';
    this.passwordRepeat = '';
    this.showPasswordModal = false;
  }

  toggleUserModalClose() {
    this.updateUserFrom.reset();
    this.updateUserFrom
      .get('user')
      ?.setValue(this.professionalInformation.user);
    this.showUserModal = false;
  }

  togglePersonalModal() {
    this.showPersonalModal = !this.showPersonalModal;
    this.showAllProfession();
  }

  togglePersonalModalClose() {
    this.updatePersonalInfoFrom.reset();
    this.updatePersonalInfoFrom
      .get('profesion')
      ?.setValue(this.userProfession.id_profesion);
    this.updatePersonalInfoFrom
      .get('telefono')
      ?.setValue(this.professionalInformation.telefono);
    this.showPersonalModal = false;
  }

  get canUpdateUser(): boolean {
    return (
      this.updateUserFrom.valid &&
      this.updateUserFrom.dirty &&
      this.updateUserFrom.get('user')?.value.length >= 6 &&
      this.updateUserFrom.get('user')?.value.length <= 24
    );
  }

  get canUpdatePassword(): boolean {
    const password = this.user_password.password;
    return (
      password.length >= 6 &&
      password.length <= 24 &&
      this.passwordRepeat.length >= 6 &&
      this.passwordRepeat.length <= 24 &&
      password === this.passwordRepeat
    );
  }

  get canUpdatePersonalInfo(): boolean {
    return (
      this.updatePersonalInfoFrom.valid && this.updatePersonalInfoFrom.dirty
    );
  }

  updateUserPassword() {
    if (this.user_password.password !== this.passwordRepeat) {
      Notify.warning('Las contraseñas no coinciden.');
    } else {
      Confirm.show(
        'Actualización',
        `¿Guardar nueva contraseña para el profesional con CI: ${this.professionalInformation.cedula}?`,
        'Confirmar',
        'Cancelar',
        () => {
          console.log(this.user_password.password);
          this.professionalService
            .updatePasswordInApi(
              this.user_auth_info!.id_Profesional,
              this.user_password
            )
            .subscribe({
              next: (resp) => {
                Notify.success('Actualización exitosa');
                this.togglePasswordModalClose();
                this.ngOnInit();
              },
              error: (e) => {
                this.togglePasswordModalClose();
                Report.failure(
                  '¡Ups! Algo ha salido mal',
                  `${e.error.message}`,
                  'Volver'
                );
              },
            });
        },
        () => {
          Notify.failure('Actualización cancelada');
        }
      );
    }
  }

  updateUserInfo() {
    const newUserValue: string = this.updateUserFrom.get('user')?.value;
    /* console.log(newNicknameValue); */
    this.professionalService.verifyProfessionalUser(newUserValue).subscribe({
      next: (response) => {
        Confirm.show(
          'Actualización',
          ` ¿Guardar nuevo usuario para el profesional con CI: ${this.professionalInformation.cedula}?`,
          'Confirmar',
          'Cancelar',
          () => {
            this.professionalService
              .updateProfessionalInApi(
                this.user_auth_info!.id_Profesional,
                this.updateUserFrom.value
              )
              .subscribe({
                next: (resp) => {
                  Notify.success('Actualización exitosa');
                  this.toggleUserModalClose();
                  this.ngOnInit();
                },
                error: (e) => {
                  this.toggleUserModalClose();
                  Report.failure(
                    '¡Ups! Algo ha salido mal',
                    ` ${e.error.message}`,
                    'Volver'
                  );
                },
              });
          },
          () => {
            Notify.failure('Actualización cancelada');
          }
        );
      },
      error: (e) => {
        Notify.failure('El usuario ya existe, ingrese uno nuevo.');
      },
    });
  }

  updatePersonalInformation() {
    Confirm.show(
      'Actualización',
      `¿Guardar cambios para el usuario con CI: ${this.professionalInformation.cedula}?`,
      'Confirmar',
      'Cancelar',
      () => {
        this.professionalService
          .updateProfessionalInApi(
            this.user_auth_info!.id_Profesional,
            this.updatePersonalInfoFrom.value
          )
          .subscribe({
            next: (resp) => {
              Notify.success('Actualización exitosa');
              this.togglePersonalModalClose();
              this.ngOnInit();
            },
            error: (e) => {
              this.togglePersonalModalClose();
              Report.failure(
                '¡Ups! Algo ha salido mal',
                `${e.error.message}`,
                'Volver'
              );
            },
          });
      },
      () => {
        Notify.failure('Actualización cancelada');
      }
    );
  }

  showAllProfession() {
    this.professionService.showProfessionInApi().subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.list_professions = respuesta;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }
}
