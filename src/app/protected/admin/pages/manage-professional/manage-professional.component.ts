import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { Notify, Report, Confirm } from 'notiflix';
import { BrigadeEaisService } from 'src/app/protected/apiservice/brigade-eais.service';
import { ProfessionService } from 'src/app/protected/apiservice/profession.service';
import { ProfessionalService } from 'src/app/protected/apiservice/professional.service';
import {
  BrigadaEAIS,
  Profesion,
  Profesional,
} from 'src/app/protected/prointerfaces/api.interface';

@Component({
  selector: 'app-manage-professional',
  templateUrl: './manage-professional.component.html',
  styleUrls: ['./manage-professional.component.css'],
})
export class ManageProfessionalComponent implements OnInit {
  /* Modal */
  open_create_professional: boolean = false;

  updateProfessional: Profesional = Object.create([]);
  trueState: boolean = true;

  brigadaEaisEnable: BrigadaEAIS = Object.create([]);

  list_professions: Profesion[] = [];
  all_professional: Profesional[] = [];

  /* variable para actualizar fecha */
  getDateNow: Date = new Date();

  user_password = {
    password: '',
  };

  /* PAGINACION */
  public searchProfessionalString: string = '';
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = false;
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 20,
    currentPage: 1,
  };
  public labels: any = {
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'Pág.',
    screenReaderCurrentLabel: `Página nro.`,
  };
  public eventLog: string[] = [];
  /* P---------------------------------- */

  createFormProfessional: FormGroup = this.fb.group({
    profesion: ['', [Validators.required]],
    role: ['', [Validators.required]],
    cedula: [
      '',
      [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.minLength(8),
        Validators.maxLength(10),
      ],
    ],
    nombres: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    apellidos: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    telefono: [
      '',
      [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.maxLength(20),
      ],
    ],
    user: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(16)],
    ],

    state: true,
  });

  updateFormProfessional = {
    state: false,
  };

  updateFormBrigadeEais = {
    state: false,
    fecha_actualizacion: '',
  };

  constructor(
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    private professionService: ProfessionService,
    private brigadeEaisService: BrigadeEaisService
  ) {}

  /*  MOSTRAR PROFESIONAL */
  ngOnInit(): void {
    this.searchAllProfessionals();
  }

  searchAllProfessionals() {
    this.professionalService.showProfessionalinApi().subscribe({
      next: (prof) => {
        this.all_professional = prof;
      },
      error: (err) => {
        this.all_professional = Object.create([]);
      },
    });
  }
  /* MODAL */
  addProfessional() {
    this.professionalService
      .createProfessionalInApi(this.createFormProfessional.value)
      .subscribe({
        next: (respuesta) => {
          Notify.success('El profesional se agrego correctamente');
          this.createFormProfessional.reset(this.clearDataInputsProfessional);
          this.searchAllProfessionals();
        },
        error: (err) => {
          Report.failure(
            'Algo ha salido mal',
            `Detalles: ${err.error.message}.`,
            'Volver'
          );
          this.createFormProfessional.reset(this.clearDataInputsProfessional);
          this.searchAllProfessionals();
        },
      });

    /* despues de todo */
    this.toggleCreateProfessionalModalClose();
  }

  showAllProfession() {
    this.professionService.showProfessionInApi().subscribe({
      next: (respuesta) => {
        this.list_professions = respuesta;
      },
      error: (err) => {
        Report.failure(
          'Algo ha salido mal',
          `Detalles: ${err.error.message}.`,
          'Volver'
        );
      },
    });
  }

  updateProfessionalData(
    idUpdateProfessional: string,
    stateUpdateProfesional: boolean
  ) {
    this.searchBrigadeEaisEnable(idUpdateProfessional);
    this.updateFormBrigadeEais.fecha_actualizacion =
      this.getDateNow.toISOString();

    Confirm.show(
      'Actualizar Profesional',
      'Desea cambiar el estado del profesional!',
      'Aceptar',
      'Cancelar',
      () => {
        this.updateProfessional.state = !stateUpdateProfesional;

        this.professionalService
          .updateProfessionalStateInApi(
            idUpdateProfessional,
            this.updateProfessional
          )
          .subscribe({
            next: (respuesta) => {
              this.searchAllProfessionals();
              Notify.success('El profesional se actualizo correctamente');
            },
            error: (err) => {
              Report.failure(
                'Algo ha salido mal',
                `Detalles: ${err.error.message}.`,
                'Volver'
              );
            },
          });
        if (this.brigadaEaisEnable) {
          this.updateBrigadeState(this.brigadaEaisEnable.id_brigadaeais);
        }
      },
      () => {
        this.searchAllProfessionals();
        Notify.failure('Actualización cancelada');
      }
    );
  }

  searchBrigadeEaisEnable(id: string) {
    this.professionalService
      .shearchProfessionalBrigadaEaisEnable(id)
      .subscribe({
        next: (respuesta) => {
          this.brigadaEaisEnable = respuesta.brigadaEai[0];
        },
        error: (err) => {
          this.brigadaEaisEnable = Object.create([]);
        },
      });
  }

  updateBrigadeState(id: string) {
    if (id) {
      this.brigadeEaisService

        .updateBrigadeEaisStateInApi(id, this.updateFormBrigadeEais)
        .subscribe({
          next: (respuesta) => {},
          error: (err) => {},
        });
    }
  }

  toggleOpenModalProfessional() {
    this.showAllProfession();
    this.open_create_professional = !this.open_create_professional;
  }

  toggleCreateProfessionalModalClose() {
    /* limpiar formulario */
    this.open_create_professional = false;

    this.createFormProfessional.reset(this.clearDataInputsProfessional);
  }

  get clearDataInputsProfessional() {
    return {
      role: '',
      cedula: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      profesion: '',
      user: '',
      password: '',
      state: true,
    };
  }

  resetPassword(professional: Profesional) {
    const id = professional.id_profesional;
    this.user_password.password = professional.cedula;
    const profesional = professional.nombres + ' ' + professional.apellidos;

    Confirm.show(
      'Reestablecer contraseña',
      `Desea establecer el CI como contraseña para el usuraio ${profesional}!`,
      'Aceptar',
      'Cancelar',
      () => {
        this.professionalService
          .updatePasswordInApi(id, this.user_password)
          .subscribe({
            next: (respuesta) => {
              this.user_password.password = '';
              Notify.success('La contraseña ha sido reestablecida');
            },
            error: (err) => {
              this.user_password.password = '';
              Report.failure(
                'Actualización fallida',
                `Detalles: ${err}`,
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

  /* EVENTOS DE PAGINACION */
  onPageChange(number: number) {
    this.logEvent(`pageChange(${number})`);
    this.config.currentPage = number;
  }

  onPageBoundsCorrection(number: number) {
    this.logEvent(`pageBoundsCorrection(${number})`);
    this.config.currentPage = number;
  }

  private logEvent(message: string) {
    this.eventLog.unshift(`${new Date().toISOString()}: ${message}`);
  }
}
