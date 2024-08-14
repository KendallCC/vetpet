import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SucursalService } from '../../../share/services/sucursal.service';
import { UsuarioService } from '../../../share/services/usuario.service';
import { FormvalidationsService } from '../../../share/formvalidations.service'; 
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-agregar-editar-usuario',
  templateUrl: './agregar-editar-usuario.component.html',
  styleUrl: './agregar-editar-usuario.component.css'
})
export class AgregarEditarUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  roles = ['cliente', 'encargado', 'administrador'];
  sucursales = [];
  isEditMode: boolean = false;
  minDate: Date;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgregarEditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number },
    private usuarioService: UsuarioService,
    private sucursalService: SucursalService,
    private formValidationService:FormvalidationsService
  ) { }

  ngOnInit(): void {

  // Calcula la fecha mínima permitida (hace 18 años desde hoy)
  // Calcula la fecha mínima permitida (18 años atrás desde hoy)
  const today = new Date();
  this.minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      telefono: ['', [Validators.required,Validators.minLength(8) ]],
      correo_electronico: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      fecha_nacimiento: ['', [Validators.required]],
      rol: ['', Validators.required],
      id_sucursal: ['', Validators.required]
    });
  
    // Cargar las sucursales
    this.sucursalService.getSucursales().subscribe(sucursales => {
      this.sucursales = sucursales;
    });
  
    // Si es edición, cargar los datos del usuario
    if (this.data.id) {
      this.isEditMode = true;
      this.usuarioService.getCliente(this.data.id).subscribe(usuario => {
        this.usuarioForm.patchValue(usuario);
      });
    }
  }
  
  // Filtro de fechas para el mat-datepicker
  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    return date ? date <= today && date <= this.minDate : true;
  }


  onSave(): void {
    console.log(this.usuarioForm);
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;

      this.usuarioService.updateCliente(this.data.id, usuarioData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }


  isFieldInvalid(field: string): boolean {
    return this.formValidationService.isFieldInvalid(this.usuarioForm, field);
  }

  getErrorMessage(field: string): string {
    return this.formValidationService.getErrorMessage(this.usuarioForm, field);
  }
  

}
