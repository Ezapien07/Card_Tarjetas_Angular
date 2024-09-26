import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { TarjetaService } from '../../services/tarjeta.service';
import { error } from 'console';

@Component({
  selector: 'app-tarjeta-credito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarjeta-credito.component.html',
  styleUrl: './tarjeta-credito.component.css',
})
export class TarjetaCreditoComponent {
  lstTarjetas: any[] = [];
  form: FormGroup;
  accion = 'Agregar';
  id: number | undefined;

  constructor(
    private fb: FormBuilder,
    private _tarjetaService: TarjetaService
  ) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numTarjeta: [
        '',
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(16),
        ],
      ],
      fechaExp: [
        '',
        [Validators.required, Validators.maxLength(5), Validators.minLength(5)],
      ],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas() {
    this._tarjetaService.getListTarjetas().subscribe(
      (data) => {
        this.lstTarjetas = data;
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  guardarTarjeta() {
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numTarjeta: this.form.get('numTarjeta')?.value,
      fechaExp: this.form.get('fechaExp')?.value,
      cvv: this.form.get('cvv')?.value,
    };
    if (this.id == undefined) {
      this.agregarTarjeta(tarjeta);
    } else {
      tarjeta.id=this.id;
      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(
        (data) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tarjeta actualizada con exito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.form.reset();
          this.obtenerTarjetas();
        },
        (error) => {
          console.log(error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo guardar la tarjeta',
            icon: 'error',
          });
        }
      );
      this.accion='Agregar';
      this.id=undefined;
      this.form.reset();
      this.obtenerTarjetas();
    }
  }

  agregarTarjeta(tarjeta: any) {
    console.log(this.form);

    this._tarjetaService.saveTarjeta(tarjeta).subscribe(
      (data) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Tarjeta guardada con exito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.form.reset();
        this.obtenerTarjetas();
      },
      (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar la tarjeta',
          icon: 'error',
        });
      }
    );
    //this.lstTarjetas.push(tarjeta);
  }
  actualizarTarjeta() {}

  eliminarTarjeta(id: number) {
    this._tarjetaService.deleteTarjeta(id).subscribe(
      (data) => {
        Swal.fire({
          title: 'Tarjeta Eliminada!',
          text: 'La tarjeta se eliminó con éxito',
          icon: 'success', // Cambiado a "success" para indicar éxito
        });
        this.obtenerTarjetas();
      },
      (error) => {
        console.error('Error al eliminar tarjeta:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la tarjeta',
          icon: 'error',
        });
      }
    );
  }

  editarTarjeta(tarjeta: any) {
    this.accion = 'Editar';
    this.id = tarjeta.id;
    this.form.patchValue({
      titular: tarjeta.titular,
      numTarjeta: tarjeta.numTarjeta,
      fechaExp: tarjeta.fechaExp,
      cvv: tarjeta.cvv,
    });
  }
}
