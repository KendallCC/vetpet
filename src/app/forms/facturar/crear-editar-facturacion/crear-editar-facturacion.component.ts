import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators,AbstractControl, ValidatorFn  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacturaService } from '../../../share/services/factura.service';
import { ProductService } from '../../../share/services/product.service';
import { ServicesService } from '../../../share/services/services.service';
import { UsuarioService } from '../../../share/services/usuario.service';
import { SucursalService } from '../../../share/services/sucursal.service';
import { GlobalService } from '../../../share/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from '../../../share/interfaces/cliente';
import { Producto } from '../../../share/interfaces/product';
import { Servicio } from '../../../share/interfaces/servicio';
import { ChangeDetectorRef } from '@angular/core';
import { FormvalidationsService } from '../../../share/formvalidations.service';

@Component({
  selector: 'app-crear-editar-facturacion',
  templateUrl: './crear-editar-facturacion.component.html',
  styleUrls: ['./crear-editar-facturacion.component.css'],
})
export class CrearEditarFacturacionComponent implements OnInit {
  facturaForm: FormGroup;
  productos: Producto[] = [];
  servicios: Servicio[] = [];
  clientes: Cliente[] = [];
  encargado: any;
  sucursalNombre: string = '';
  sucursalId: number | null = null;
  subtotal: number = 0;
  impuesto: number = 0;
  total: number = 0;
  editingIndex: number | null = null;
  readonly IMPUESTO_PORCENTAJE = 0.13; // 13% de impuesto, ajusta según tu necesidad

  productosDataSource: any[] = [];
  serviciosDataSource: any[] = [];

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private usuarioService: UsuarioService,
    private productoService: ProductService,
    private servicioService: ServicesService,
    private sucursalService: SucursalService,
    private globalService: GlobalService,
    private toastr: ToastrService,
    public formvalidadation:FormvalidationsService,
    private dialogRef: MatDialogRef<CrearEditarFacturacionComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProductosYServicios();
  
    const encargadoId: number = +this.globalService.getVariableGlobal();
    this.loadEncargadoYsuSucursal(encargadoId);
  
    // Verificar si se está editando una factura existente
    if (this.data && this.data.idFactura) {
      this.loadFactura(this.data.idFactura);
    }
  }
  initForm() {
    this.facturaForm = this.fb.group({
      fecha_factura: [{ value: new Date(), disabled: true }, Validators.required],
      sucursal: [{ value: '', disabled: true }],
      cliente: [null, Validators.required],
      encargado: [{ value: '', disabled: true }],
      detalle_productos: this.fb.array([]),
      detalle_servicios: this.fb.array([]),
      subtotal: [{ value: this.subtotal, disabled: true }],
      impuesto: [{ value: this.impuesto, disabled: true }],
      total: [{ value: this.total, disabled: true }],
      estado: [null, Validators.required], // Añadir el campo estado
      metodo_pago: [null, Validators.required],
      selectedProduct: this.fb.group({
        producto: [null],
        cantidad: [1, [Validators.required, Validators.min(1), Validators.max(15), Validators.pattern('^[0-9]*$')]], 
        precio_unitario: [{ value: '', disabled: true }],
      }),
      selectedService: this.fb.group({
        servicio: [null],
        tarifa: [{ value: '', disabled: true }],
      }),
    }, { validators: this.atLeastOneProductOrServiceValidator() }); // Aplica la validación aquí
  }

  get detalleProductos(): FormArray {
    return this.facturaForm.get('detalle_productos') as FormArray;
  }

  get detalleServicios(): FormArray {
    return this.facturaForm.get('detalle_servicios') as FormArray;
  }

  addProducto() {
    const selectedProduct = this.facturaForm.get('selectedProduct')?.value;
    const producto = this.productos.find(p => p.id === selectedProduct.producto);
  
    if (producto) {
      // Verificar si el producto ya está en la lista
      const existingProductIndex = this.detalleProductos.controls.findIndex(
        (group) => group.get('id_producto')?.value === producto.id
      );
  
      if (existingProductIndex !== -1) {
        // Si el producto ya existe, actualizarlo
        const existingProductGroup = this.detalleProductos.at(existingProductIndex) as FormGroup;
        const nuevaCantidad = selectedProduct.cantidad;
        const nuevoTotal = nuevaCantidad * producto.precio;
        existingProductGroup.patchValue({
          cantidad: nuevaCantidad,
          total_item: nuevoTotal,
        });
  
        
        this.formvalidadation.mensajeExito('Producto actualizado en la lista.','Actualización de producto')
      } else {
        // Si el producto no existe, agregarlo
        const productoGroup = this.fb.group({
          id_producto: [producto.id], // Incluye el ID del producto aquí
          producto: [producto.nombre],
          cantidad: [selectedProduct.cantidad],
          precio_unitario: [{ value: producto.precio, disabled: true }],
          total_item: [{ value: producto.precio * selectedProduct.cantidad, disabled: true }],
        });
        this.formvalidadation.mensajeExito('Producto Agregado en la lista.','Agregacion de producto')
        this.detalleProductos.push(productoGroup);
      }
  
      this.productosDataSource = this.detalleProductos.getRawValue();
      this.facturaForm.get('selectedProduct')?.reset({ producto: null, cantidad: 1, precio_unitario: '' });
      this.calculateTotal();
      this.cdr.detectChanges(); // Forzar la detección de cambios para actualizar la vista
    }
  }
  
  
  

  editProducto(index: number) {
    const producto = this.detalleProductos.at(index).value;
    const selectedProduct = this.productos.find(p => p.nombre === producto.producto);

    if (selectedProduct) {
      this.facturaForm.get('selectedProduct')?.patchValue({
        producto: selectedProduct.id,
        cantidad: producto.cantidad,
        precio_unitario: selectedProduct.precio,
      });
    
      this.editingIndex = index;
    }
  }

  removeProducto(index: number) {
    this.detalleProductos.removeAt(index);
    this.productosDataSource = this.detalleProductos.getRawValue();
    this.calculateTotal();
     this.formvalidadation.mensajeExito('Producto Eliminado de la lista.','Actualizacion')
    this.cdr.detectChanges(); // Forzar la detección de cambios para actualizar la vista
  }

  removeServicio(index: number) {
    this.detalleServicios.removeAt(index);
    this.serviciosDataSource = this.detalleServicios.getRawValue();
    this.calculateTotal();
    this.cdr.detectChanges(); // Forzar la detección de cambios para actualizar la vista
  }

  calculateTotal() {
    const subtotalProductos = this.detalleProductos.controls.reduce((acc, curr) => {
      return acc + (curr.get('total_item')?.value || 0);
    }, 0);

    const subtotalServicios = this.detalleServicios.controls.reduce((acc, curr) => {
      return acc + (curr.get('total_item')?.value || 0);
    }, 0);

    this.subtotal = subtotalProductos + subtotalServicios;
    this.impuesto = this.subtotal * this.IMPUESTO_PORCENTAJE;
    this.total = this.subtotal + this.impuesto;

    this.facturaForm.patchValue({
      subtotal: this.subtotal,
      impuesto: this.impuesto,
      total: this.total,
    });
  }

  loadProductosYServicios() {
    this.productoService.getProducts().subscribe(productos => {
      this.productos = productos;
    });

    this.servicioService.getServices().subscribe(servicios => {
      this.servicios = servicios;
    });
  }

  loadEncargadoYsuSucursal(encargadoId: number) {
    this.usuarioService.getCliente(encargadoId).subscribe(encargado => {
      this.encargado = encargado;
      this.sucursalService.getSucursal(encargado.id_sucursal).subscribe(sucursal => {
        this.sucursalNombre = sucursal.nombre;
        this.sucursalId = sucursal.id;
        this.facturaForm.patchValue({
          encargado: this.encargado.nombre,
          sucursal: this.sucursalNombre,
        });

        this.loadClientes(); // Cargar clientes después de obtener la sucursal
      });
    });
  }

  loadClientes() {
    if (this.sucursalId) {
      this.usuarioService.getClientes().subscribe(clientes => {
        this.clientes = clientes.filter(cliente => cliente.id_sucursal === this.sucursalId);
      });
    }
  }

  loadFactura(idFactura: number) {
    this.facturaService.getFactura(idFactura).subscribe(factura => {

     console.log('factura: ',factura);
     

      this.facturaForm.patchValue({
        fecha_factura: new Date(factura.fecha_factura),
        sucursal: factura.cita.sucursal.nombre,
        cliente: factura.cita.cliente.id,
        encargado: this.encargado.nombre,
        estado:factura.estado,
        metodo_pago:factura.metodo_pago
      });
  
      this.detalleProductos.clear();
      this.detalleServicios.clear();
  
      factura.detalle_factura.forEach(detalle => {
        if (detalle.producto) {
          const productoGroup = this.fb.group({
            id_producto: detalle.producto.id,
            producto: detalle.producto.nombre,
            cantidad: detalle.cantidad,
            precio_unitario: [{ value: detalle.precio_unitario, disabled: true }],
            total_item: [{ value: detalle.total_item, disabled: true }],
          });
          this.detalleProductos.push(productoGroup);
        }
  
        if (detalle.servicio) {
          const servicioGroup = this.fb.group({
            id_servicio: detalle.servicio.id,
            servicio: detalle.servicio.nombre,
            precio_unitario: [{ value: detalle.precio_unitario, disabled: true }],
            total_item: [{ value: detalle.total_item, disabled: true }],
          });
          this.detalleServicios.push(servicioGroup);
        }
      });
  
      this.productosDataSource = this.detalleProductos.getRawValue();
      this.serviciosDataSource = this.detalleServicios.getRawValue();
      this.calculateTotal();
      this.cdr.detectChanges(); // Forzar la detección de cambios para actualizar la vista
    });
  }

  getClienteEmail(): string {
    const clienteId = this.facturaForm.get('cliente')?.value;
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.correo_electronico : '';
  }

  save() {

    if (this.facturaForm.invalid) {
      if (this.facturaForm.errors?.["noProductOrService"]) {
        this.formvalidadation.mensajeError('Debe agregar al menos un producto o servicio.','Error de validación')
      } else {
        this.formvalidadation.mensajeError('Por favor, complete todos los campos requeridos.','Error de validación')
        
      }
      return;
    }

    if (this.facturaForm.valid) {
      const facturaData = this.facturaForm.getRawValue();
     
      

      if (this.data && this.data.idFactura) {
        this.facturaService.updateFactura( this.data.idFactura,facturaData).subscribe(() => {
          this.formvalidadation.mensajeExito('Factura Editada exitosamente','Editar Factura')
          this.dialogRef.close(true);
        });
      } else {
        this.facturaService.postFactura(facturaData).subscribe(() => {
          
          this.formvalidadation.mensajeExito('Factura guardada exitosamente','Agregar Factura')
          this.dialogRef.close(true);
        });
      }
    } else {
      
      this.formvalidadation.mensajeError('Por favor, complete todos los campos requeridos','Error')
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  get selectedProductForm(): FormGroup {
    return this.facturaForm.get('selectedProduct') as FormGroup;
  }
  
  get selectedServiceForm(): FormGroup {
    return this.facturaForm.get('selectedService') as FormGroup;
  }

  onProductChange() {
    const selectedProduct = this.facturaForm.get('selectedProduct')?.get('producto')?.value;
    const producto = this.productos.find(p => p.id === selectedProduct);
    if (producto) {
      this.facturaForm.get('selectedProduct')?.get('precio_unitario')?.setValue(producto.precio);
    }
  }
  
  onServiceChange() {
    const selectedService = this.facturaForm.get('selectedService')?.get('servicio')?.value;
    const servicio = this.servicios.find(s => s.id === selectedService);
    if (servicio) {
      this.facturaForm.get('selectedService')?.get('tarifa')?.setValue(servicio.tarifa);
    }
  }



   atLeastOneProductOrServiceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const detalleProductos = control.get('detalle_productos') as FormArray;
      const detalleServicios = control.get('detalle_servicios') as FormArray;
  
      if (detalleProductos.length === 0 && detalleServicios.length === 0) {
        return { 'noProductOrService': true };
      }
      return null;
    };
  }



  isFieldInvalid(field: string): boolean {
    return this.formvalidadation.isFieldInvalid(this.facturaForm, field);
  }

  getErrorMessage(field: string): string {
    return this.formvalidadation.getErrorMessage(this.facturaForm, field);
  }

}
