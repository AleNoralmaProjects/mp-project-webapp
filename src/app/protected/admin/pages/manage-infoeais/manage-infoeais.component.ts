import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notify, Report } from 'notiflix';
import { InfoEaisService } from 'src/app/protected/apiservice/info-eais.service';
import { InfoEais } from 'src/app/protected/prointerfaces/api.interface';

@Component({
  selector: 'app-manage-infoeais',
  templateUrl: './manage-infoeais.component.html',
  styleUrls: ['./manage-infoeais.component.css'],
})
export class ManageInfoeaisComponent implements OnInit {
  /* MODAL */
  open_create_infoeais: boolean = false;

  all_infoEais: InfoEais[] = [];

  /* FORMULARIO */
  createFormInfoEais: FormGroup = this.fb.group({
    cod_eais: [
      '',
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(16),
        Validators.pattern(/^[a-zA-Z0-9]*$/),
      ],
    ],
    parroquia: [
      'CHAMBO',
      [Validators.required, Validators.minLength(4), Validators.maxLength(24)],
    ],
    canton: [
      'CHAMBO',
      [Validators.required, Validators.minLength(4), Validators.maxLength(24)],
    ],
    provincia: [
      'CHIMBORAZO',
      [Validators.required, Validators.minLength(4), Validators.maxLength(24)],
    ],
    distrito: [
      '06DO1',
      [Validators.required, Validators.minLength(4), Validators.maxLength(24)],
    ],
    zona: [
      '3',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        Validators.pattern('[0-9]+'),
      ],
    ],
  });

  /* CONSTRUCTOR  */
  constructor(
    private fb: FormBuilder,
    private infoEaisService: InfoEaisService
  ) {}

  /* MOSTRAR INFO EAIS */
  ngOnInit(): void {
    this.infoEaisService.showInfoEaisInApi().subscribe({
      next: (prof) => {
        this.all_infoEais = prof;
      },
      error: (err) => {
        this.all_infoEais = Object.create([]);
      },
    });
  }

  /* FUNCIONES  */
  /* REGISTRAR INFO EAIS */
  addInfoEais() {
    this.infoEaisService
      .createInfoEaisInApi(this.createFormInfoEais.value)
      .subscribe({
        next: (respuesta) => {
          Notify.success('El profesional se agrego correctamente');
          this.createFormInfoEais.reset(this.clearDataInpustEais);
          this.ngOnInit();
        },
        error: (err) => {
          Report.failure(
            'Algo ha salido mal',
            `Detalles: ${err.error.message}.`,
            'Volver'
          );
          this.createFormInfoEais.reset(this.clearDataInpustEais);
          this.ngOnInit();
        },
      });

    /* despues de todo */
    this.toogleCreateInfoEaisModalClose();
  }

  /* MODAL ADD INFO EAIS */
  toggleOpenModalInfoEais() {
    this.open_create_infoeais = !this.open_create_infoeais;
  }

  toogleCreateInfoEaisModalClose() {
    /* limpiar formulario */
    this.open_create_infoeais = false;

    this.createFormInfoEais.reset(this.clearDataInpustEais);
  }

  /* FUNCIONES PARA BORRAR DATOS EN LOS FORMS */

  get clearDataInpustEais() {
    return {
      cod_eais: '',
      parroquia: 'CHAMBO',
      canton: 'CHAMBO',
      provincia: 'CHIMBORAZO',
      distrito: '06D01',
      zona: '3',
    };
  }
}
