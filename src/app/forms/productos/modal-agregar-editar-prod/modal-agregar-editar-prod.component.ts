import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormvalidationsService } from '../../../share/formvalidations.service';
import { ProductService } from '../../../share/services/product.service';
import { Producto } from '../../../share/interfaces/product';
import { CategoriaService } from '../../../share/services/categoria.service';
import { listaCategoria } from '../../../share/interfaces/categoria';

@Component({
  selector: 'app-modal-agregar-editar-prod',
  templateUrl: './modal-agregar-editar-prod.component.html',
  styleUrl: './modal-agregar-editar-prod.component.css'
})
export class ModalAgregarEditarProdComponent {
  form: FormGroup;
  operacion: string = 'Agregar '
  categorias:listaCategoria;
  id: number | undefined
  constructor(
    public dialogRef: MatDialogRef<ModalAgregarEditarProdComponent>,
    private fb: FormBuilder,
    private validationService: FormvalidationsService,
    private Producto: ProductService,
    private serviceCategoria:CategoriaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      id_categoria: ['', [Validators.required]],
      precio: ['0', [Validators.required, Validators.min(1000), Validators.pattern(/^[0-9]+$/)]],
      Marca: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      Tipo_mascota: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
     
    });
    this.id = data.id
  }

  ngOnInit(): void {
    this.esEditar(this.id)
    this.getCategorias()
  }


  esEditar(id: number | undefined) {
    if (id !== undefined) {
      this.operacion = 'Editar '
      this.getProducto(id)
    }
  }


  getCategorias(){
    this.serviceCategoria.getCategorias().subscribe(data=>{
      this.categorias=data
      console.log(data);
      
    })
  }

  getProducto(id: number) {
    this.Producto.getProduct(id).subscribe(data => {


      this.form.setValue({
        nombre: data.nombre,
        descripcion: data.descripcion,
        id_categoria: data.categoria.id,
        precio: data.precio,
        Marca: data.Marca,
        Tipo_mascota: data.Tipo_mascota
      })
    })
  }


  cancelar() {
    this.dialogRef.close();
  }

  addEdit() {

    const Producto: Producto = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      categoria: this.form.value.id_categoria,
      precio: this.form.value.precio,
      Marca: this.form.value.Marca,
      Tipo_mascota: this.form.value.Tipo_mascota
    }

    if (this.id == undefined) {

      this.Producto.postProducto(Producto).subscribe(() => {
        this.validationService.mensajeExito("se han agregado con exito los datos","Agregacion")
      })

    } else {
      this.Producto.updateProducto(this.id, Producto).subscribe(() => {
        this.validationService.mensajeExito("se han actualizado con exito los datos","Actualizacion")
      })
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
