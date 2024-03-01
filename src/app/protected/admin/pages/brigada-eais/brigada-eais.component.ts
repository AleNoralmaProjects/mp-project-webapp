import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BrigadaEAIS,
  InfoEais,
  Profesional,
} from 'src/app/protected/prointerfaces/api.interface';
import { BrigadeEaisService } from '../../../apiservice/brigade-eais.service';
import { ProfessionalService } from 'src/app/protected/apiservice/professional.service';
import { InfoEaisService } from 'src/app/protected/apiservice/info-eais.service';
import { Confirm, Notify, Report } from 'notiflix';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-brigada-eais',
  templateUrl: './brigada-eais.component.html',
  styleUrls: ['./brigada-eais.component.css'],
})
export class BrigadaEaisComponent implements OnInit {
  /*   OBTENER DATOS EN LAS VARIABLES QUE NECESITO TRAER DE LOS OTROS SERVICIOS  */

  updateBrigadeInfo: BrigadaEAIS = Object.create([]);
  trueState: boolean = true;

  /* variable para actualizar fecha */
  getDateNow: Date = new Date();

  list_professionals: Profesional[] = [];
  list_infoEais: InfoEais[] = [];

  /* PARA MOSTRAR TODAS LAS BRIGADAS EXISTENTES  */
  all_brigadeEais: BrigadaEAIS[] = [];

  /* Modal */
  open_create_brigadeEais: boolean = false;

  /* PAGINACION */
  public searchBrigadeEaisString: string = '';
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

  createFormBrigade: FormGroup = this.fb.group({
    state: true,
    eais: ['', [Validators.required]],
    profesional: ['', [Validators.required]],
    fecha_actualizacion: [''],
  });

  updateFormBrigadeEais = {
    state: false,
    fecha_actualizacion: '',
  };

  constructor(
    private fb: FormBuilder,
    private brigadeEaisService: BrigadeEaisService,
    private professionalService: ProfessionalService,
    private infoEaisService: InfoEaisService
  ) {}

  /*  MOSTRAR BRIGADA */
  ngOnInit(): void {
    this.searchAllBrigades();
  }

  searchAllBrigades() {
    this.brigadeEaisService.showBrigadeEaisInApi().subscribe({
      next: (brig) => {
        this.all_brigadeEais = brig;
      },
      error: (err) => {
        this.all_brigadeEais = Object.create([]);
      },
    });
  }

  /* MODAL */
  addBrigadeEais() {
    const createDate = new Date();

    this.createFormBrigade
      .get('fecha_actualizacion')
      ?.setValue(createDate.toISOString());

    this.brigadeEaisService
      .createBrigadeEaisInApi(this.createFormBrigade.value)
      .subscribe({
        next: (respuesta) => {
          Notify.success('La Brigada EAIS se agrego correctamente');
          this.createFormBrigade.reset(this.clearDataInputsBrigade);
          this.searchAllBrigades();
        },
        error: (err) => {
          Report.failure(
            'Algo ha salido mal',
            `Detalles: ${err.error.message}.`,
            'Volver'
          );
          this.createFormBrigade.reset(this.clearDataInputsBrigade);
          this.searchAllBrigades();
        },
      });

    /* despues de todo */
    this.toggleCreateEAISModalClose();
  }

  /*  FUNCION PARA CREAR EL LA BRIGADA CON EL PROFESIONAL  */
  showAllProfessional() {
    this.professionalService.showActiveProfessionalinApi().subscribe({
      next: (respuesta) => {
        if (respuesta !== null) {
          this.handleProfessionalsResult(respuesta);
        } else {
          this.list_professionals = [];
        }
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

  private handleProfessionalsResult(profesionals: Profesional[]) {
    this.list_professionals = profesionals.filter(
      (profesional) =>
        profesional.state && !profesional.brigadaEai.some((item) => item.state)
    );
  }

  showAllInfoEais() {
    this.infoEaisService.showInfoEaisInApi().subscribe({
      next: (respuesta) => {
        this.list_infoEais = respuesta;
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

  /* ACTUALIZAR BRIGADA*/
  updateBrigadeEaisData(idUpdateBrigade: string, stateUpdateBrigade: boolean) {
    this.updateFormBrigadeEais.state = !stateUpdateBrigade;

    this.updateFormBrigadeEais.fecha_actualizacion =
      this.getDateNow.toISOString();

    Confirm.show(
      'Actualizar Brigada',
      'Desea cambiar el estado de la Brigada!',
      'Aceptar',
      'Cancelar',

      () => {
        let verifyProfessional = this.list_professionals.filter(
          (professional) => !professional.brigadaEai.some((item) => item.state)
        );

        this.brigadeEaisService
          .updateBrigadeEaisStateInApi(
            idUpdateBrigade,
            this.updateFormBrigadeEais
          )
          .subscribe({
            next: (respuesta) => {
              Notify.success('La brigada se actualizo correctamente');
              this.searchAllBrigades();
            },
            error: (err) => {
              Report.failure(
                'Algo ha salido mal',
                `Detalles: ${err.error.message}.`,
                'Volver'
              );
            },
          });
      },
      () => {
        this.searchAllBrigades();
        Notify.failure('Actualización cancelada');
      }
    );
  }

  toggleOpenModal() {
    this.showAllProfessional();
    this.showAllInfoEais();
    this.open_create_brigadeEais = !this.open_create_brigadeEais;
  }

  toggleCreateEAISModalClose() {
    /* limpiar formulario */
    this.open_create_brigadeEais = false;

    this.createFormBrigade.reset(this.clearDataInputsBrigade);
  }

  get clearDataInputsBrigade() {
    return {
      state: true,
      eais: '',
      profesional: '',
      fecha_actualizacion: '',
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
