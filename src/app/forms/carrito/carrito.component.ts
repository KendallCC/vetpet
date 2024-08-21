import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FacturaService } from '../../share/services/factura.service';
import { CarritoService } from '../../share/services/carrito.service';
import { Producto } from '../../share/interfaces/product';
import { Servicio } from '../../share/interfaces/servicio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  facturaForm: FormGroup;
  subtotal: number = 0;
  impuesto: number = 0;
  total: number = 0;
  readonly IMPUESTO_PORCENTAJE = 0.13;
  private originalServiciosCount = 0;

  displayedColumnsProductos: string[] = ['nombre', 'cantidad', 'precio_unitario', 'total_item', 'acciones'];
  displayedColumnsServicios: string[] = ['nombre', 'precio_unitario', 'total_item', 'acciones'];
  dataSourceProductos: MatTableDataSource<AbstractControl>;
  dataSourceServicios: MatTableDataSource<AbstractControl>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private facturaService: FacturaService,
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef,
    private Router:Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  ngAfterViewInit() {
    if (this.dataSourceProductos) {
      this.dataSourceProductos.paginator = this.paginator;
    }
    if (this.dataSourceServicios) {
      this.dataSourceServicios.paginator = this.paginator;
    }
  }

  initForm() {
    this.facturaForm = this.fb.group({
      detalle_productos: this.fb.array([]),
      detalle_servicios: this.fb.array([]),
      metodo_pago: ['Efectivo', Validators.required],
      estado: [{ value: 'Facturada', disabled: true }, Validators.required]
    });
  }

  get detalleProductos(): FormArray {
    return this.facturaForm.get('detalle_productos') as FormArray;
  }

  get detalleServicios(): FormArray {
    return this.facturaForm.get('detalle_servicios') as FormArray;
  }

  loadInitialData(): void {
    const productos: Producto[] = this.carritoService.obtenerCarritoProductos();
    const servicios: Servicio[] = this.carritoService.obtenerCarritoServicios();

    productos.forEach(producto => this.addProductToFormArray(producto));
    servicios.forEach(servicio => this.addServiceToFormArray(servicio));

    this.dataSourceProductos = new MatTableDataSource(this.detalleProductos.controls);
    this.dataSourceServicios = new MatTableDataSource(this.detalleServicios.controls);

    this.calculateTotal();
    this.cdr.detectChanges();
  }

  addProductToFormArray(producto: Producto): void {
    const productoGroup = this.fb.group({
      id_producto: [producto.id, Validators.required],
      nombre: [producto.nombre, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]], // Cantidad siempre empieza en 1
      precio_unitario: [producto.precio, Validators.required],
      total_item: [{ value: producto.precio, disabled: true }]
    });

    this.detalleProductos.push(productoGroup);
  }

  addServiceToFormArray(servicio: Servicio): void {
    const servicioGroup = this.fb.group({
      id_servicio: [servicio.id, Validators.required],
      nombre: [servicio.nombre, Validators.required],
      precio_unitario: [servicio.tarifa, Validators.required],
      total_item: [{ value: servicio.tarifa, disabled: true }] // Cantidad siempre 1, total es tarifa
    });
    this.detalleServicios.push(servicioGroup);
  }

  editProducto(control: FormGroup): void {
    const cantidad = control.get('cantidad')?.value;

    if (cantidad <= 0) {
      this.removeProducto(control);
    } else {
      const precioUnitario = control.get('precio_unitario')?.value;
      control.get('total_item')?.setValue(cantidad * precioUnitario);
      this.calculateTotal();
      this.cdr.detectChanges(); // Forzar la detección de cambios
    }
  }

  removeProducto(control: FormGroup): void {
    const index = this.detalleProductos.controls.indexOf(control);
    if (index !== -1) {
      this.detalleProductos.removeAt(index);
      this.dataSourceProductos = new MatTableDataSource(this.detalleProductos.controls);
      this.calculateTotal();
      this.cdr.detectChanges(); // Forzar la detección de cambios
      this.toastr.success(`Producto eliminado del carrito.`, 'Producto Eliminado');
    }
  }

  removeServicio(control: FormGroup): void {
    const index = this.detalleServicios.controls.indexOf(control);
    if (index !== -1) {
      this.detalleServicios.removeAt(index);
      this.dataSourceServicios = new MatTableDataSource(this.detalleServicios.controls);
      this.calculateTotal();
      this.cdr.detectChanges(); // Forzar la detección de cambios
      this.toastr.success(`Servicio eliminado del carrito.`, 'Servicio Eliminado');
    }
  }

  calculateTotal(): void {
    const subtotalProductos = this.detalleProductos.controls.reduce((acc, curr) => acc + (curr.get('total_item')?.value || 0), 0);
    const subtotalServicios = this.detalleServicios.controls.reduce((acc, curr) => acc + (curr.get('total_item')?.value || 0), 0);

    this.subtotal = subtotalProductos + subtotalServicios;
    this.impuesto = this.subtotal * this.IMPUESTO_PORCENTAJE;
    this.total = this.subtotal + this.impuesto;
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  clearCart(): void {
    this.detalleProductos.clear();
    this.detalleServicios.clear();
    this.dataSourceProductos = new MatTableDataSource(this.detalleProductos.controls);
    this.dataSourceServicios = new MatTableDataSource(this.detalleServicios.controls);
    this.calculateTotal();
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  onSubmit(): void {
    const facturaId = parseInt(localStorage.getItem('currentInvoiceId'));
    const user = this.carritoService.obtenerusuario();
    // Verificar que la información del usuario esté disponible
    if (!user.id || !user.id_sucursal) {
      this.toastr.error('No se pudo obtener la información del usuario.', 'Error');
      return;
    }

    const facturaData = {
      facturaId: facturaId,
      detalle_productos: this.detalleProductos.getRawValue(),
      detalle_servicios: this.detalleServicios.getRawValue(),
      subtotal: this.subtotal || 0,
      impuesto: this.impuesto || 0,
      total: this.total || 0,
      estado: this.facturaForm.get('estado')?.value || 'Facturada',
      metodo_pago: this.facturaForm.get('metodo_pago')?.value || 'Efectivo',
      user: {
        id_cliente: user.id,
        id_sucursal: user.id_sucursal
      }
    };

    this.facturaService.postFacturaProductos(facturaData).subscribe(() => {
      this.toastr.success('Factura y citas actualizadas exitosamente', 'Actualización');
      this.clearCart();
      this.carritoService.vaciarCarrito()
      this.Router.navigate(['inicio'])
      
    });
  }


}
