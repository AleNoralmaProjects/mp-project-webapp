import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notify, Report } from 'notiflix';
import { ProfessionService } from 'src/app/protected/apiservice/profession.service';
import { Profesion } from 'src/app/protected/prointerfaces/api.interface';

@Component({
  selector: 'app-manage-profession',
  templateUrl: './manage-profession.component.html',
  styleUrls: ['./manage-profession.component.css'],
})
export class ManageProfessionComponent implements OnInit {
  /* Modal */
  open_create_profession: boolean = false;

  all_profession: Profesion[] = [];

  /* CREAR PROFESION */
  createFormProfession: FormGroup = this.fb.group({
    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9áéíóúüÜÁÉÍÓÚñÑ\s]*$/),
      ],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private professionService: ProfessionService
  ) {}

  /*  MOSTRAR PROFESION */
  ngOnInit(): void {
    this.professionService.showProfessionInApi().subscribe({
      next: (prof) => {
        console.log(prof);
        this.all_profession = prof;
      },
      error: (err) => {
        this.all_profession = Object.create([]);
      },
    });
  }

  /* MODAL AGREGAR */
  addProfession() {
    console.log('ENVIAR FORMULARIO');

    console.log(this.createFormProfession.value);
    console.log(this.createFormProfession.valid);

    this.professionService
      .createProfessionInApi(this.createFormProfession.value)
      .subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          Notify.success('La profesión se agrego correctamente');
          this.createFormProfession.reset(this.clearDataInputProfession);
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err.error.message);
          Report.failure(
            'Algo ha salido mal',
            `Detalles: ${err.error.message}.`,
            'Volver'
          );
          this.createFormProfession.reset(this.clearDataInputProfession);
          this.ngOnInit();
        },
      });

    /* despues de todo */
    this.toggleCreateProfessionModalClose();
  }

  toggleOpenModalProfession() {
    this.open_create_profession = !this.open_create_profession;
  }

  toggleCreateProfessionModalClose() {
    /* limpiar formulario */
    this.open_create_profession = false;

    this.createFormProfession.reset(this.clearDataInputProfession);
    console.log('Limpiar formulario');
  }

  /* FUNCIONES PARA BORRAR DATOS EN LOS FORMS */
  /* clearFormClosedProfesion() {
    this.createFormProfession.reset(this.clearDataInputProfession);
  } */

  get clearDataInputProfession() {
    return {
      descripcion: '',
    };
  }
}
