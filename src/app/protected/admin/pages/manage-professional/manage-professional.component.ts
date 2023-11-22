import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { Notify, Report } from 'notiflix';
import { ProfessionService } from 'src/app/protected/apiservice/profession.service';
import { ProfessionalService } from 'src/app/protected/apiservice/professional.service';
import {
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

  list_professions: Profesion[] = [];
  all_professional: Profesional[] = [];

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

  constructor(
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    private professionService: ProfessionService
  ) {}

  /*  MOSTRAR PROFESIONAL */
  ngOnInit(): void {
    this.professionalService.showProfessionalinApi().subscribe({
      next: (prof) => {
        console.log(prof);
        this.all_professional = prof;
      },
      error: (err) => {
        this.all_professional = Object.create([]);
      },
    });
  }

  /* MODAL */
  addProfessional() {
    console.log('ENVIAR FORMULARIO');

    console.log(this.createFormProfessional.value);
    console.log(this.createFormProfessional.valid);
    this.professionalService
      .createProfessionalInApi(this.createFormProfessional.value)
      .subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          Notify.success('El profesional se agrego correctamente');
          this.createFormProfessional.reset(this.clearDataInputsProfessional);
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err.error.message);
          Report.failure(
            'Algo ha salido mal',
            `Detalles: ${err.error.message}.`,
            'Volver'
          );
          this.createFormProfessional.reset(this.clearDataInputsProfessional);
          this.ngOnInit();
        },
      });

    /* despues de todo */
    this.toggleCreateProfessionalModalClose();
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

  updateProfessionalData(
    idUpdateProfessional: string,
    stateUpdateProfesional: boolean
  ) {
    console.log(idUpdateProfessional);

    console.log(!stateUpdateProfesional);

    this.updateProfessional.state = !stateUpdateProfesional;

    this.professionalService
      .updateProfessionalStateInApi(
        idUpdateProfessional,
        this.updateProfessional
      )
      .subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          Notify.success('El profesional se actualizo correctamente');
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err.error.message);
          Report.failure(
            'Algo ha salido mal',
            `Detalles: ${err.error.message}.`,
            'Volver'
          );
        },
      });
  }

  toggleOpenModalProfessional() {
    this.showAllProfession();
    this.open_create_professional = !this.open_create_professional;

    /* console.log(this.all_professional); */
  }

  toggleCreateProfessionalModalClose() {
    /* limpiar formulario */
    this.open_create_professional = false;

    this.createFormProfessional.reset(this.clearDataInputsProfessional);
    console.log('Limpiar formulario');
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
