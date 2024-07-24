import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sucursal } from '../../../share/interfaces/sucursal';
import { FormvalidationsService } from '../../../share/formvalidations.service';
import { listaClientes } from '../../../share/interfaces/cliente';
import { SucursalService } from '../../../share/services/sucursal.service';

@Component({
  selector: 'app-modal-agregar-editar-sucursal',
  templateUrl: './modal-agregar-editar-sucursal.component.html',
  styleUrl: './modal-agregar-editar-sucursal.component.css',
})
export class ModalAgregarEditarSucursalComponent {
  form: FormGroup;
  operacion: string = 'Agregar ';
  sucursal: Sucursal;
  id: number | undefined;
  listaUsuarios: listaClientes;
  constructor(
    public dialogRef: MatDialogRef<ModalAgregarEditarSucursalComponent>,
    private fb: FormBuilder,
    private validationService: FormvalidationsService,

    private serviceSucursal: SucursalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(8),
          Validators.maxLength(8)
        ],
      ], // Patrón para números de teléfono internacionales y de 10 dígitos
      direccion: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      correo_electronico: ['', [Validators.required, Validators.email]],
      usuarios: [[], Validators.required], // Asegúrate de que al menos un usuario sea seleccionado
    });
    this.id = data.id;
  }
  ngOnInit(): void {
    if (this.id !== undefined) {
      this.operacion = 'Editar ';
      this.getSucursal(this.id);
    } else {
      this.getSinSucursal();
    }
  }

  getSucursal(id: number) {
    this.serviceSucursal.getSucursal(id).subscribe((data) => {
      const usuarioIds = data.usuarios.map((usuario: any) => usuario.id);
      this.form.setValue({
        nombre: data.nombre,
        descripcion: data.descripcion,
        telefono: data.telefono,
        direccion: data.direccion,
        correo_electronico: data.correo_electronico,
        usuarios: usuarioIds,
      });
      this.getGerentes(id, usuarioIds);
    });
  }

  getGerentes(id: number, usuarioIds: number[]) {
    this.serviceSucursal.getGerentesPorSucursal(id).subscribe((data) => {
      this.listaUsuarios = data;
      this.form.patchValue({ usuarios: usuarioIds });
    });
  }

  getSinSucursal() {
    this.serviceSucursal.getGerentesSinSucursal().subscribe((data) => {
      this.listaUsuarios = data;
      console.log(this.listaUsuarios);
    });
  }

  cancelar() {
    this.listaUsuarios = [];
    this.dialogRef.close();
  }

  addEdit() {
    const sucursal: Sucursal = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      telefono: this.form.value.telefono,
      direccion: this.form.value.direccion,
      correo_electronico: this.form.value.correo_electronico,
      usuarios: this.form.value.usuarios,
    };

    if (this.id == undefined) {
      this.serviceSucursal.postSucursal(sucursal).subscribe(() => {
        this.validationService.mensajeExito(
          'Se han agregado con éxito los datos',
          'Agregación'
        );
      });
    } else {
      this.serviceSucursal.updateSucursal(this.id, sucursal).subscribe(() => {
        this.validationService.mensajeExito(
          'Se han actualizado con éxito los datos',
          'Actualización'
        );
      });
    }
    this.dialogRef.close(true);
  }

  isFieldInvalid(field: string): boolean {
    return this.validationService.isFieldInvalid(this.form, field);
  }

  getErrorMessage(field: string): string {
    return this.validationService.getErrorMessage(this.form, field);
  }
}
