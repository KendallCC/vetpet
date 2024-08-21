import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../share/services/product.service';
import { CarritoService } from '../../share/services/carrito.service';
import { Producto } from '../../share/interfaces/product';
import { Categoria } from '../../share/interfaces/categoria';
import { FormvalidationsService } from '../../share/formvalidations.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  Id: number;
  producto: Producto;
  Categoria: Categoria;
  enCarrito: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private carritoService: CarritoService,
    public formValidation: FormvalidationsService
  ) { }

  ngOnInit(): void {
    // Observa los cambios en el parámetro de ruta 'id'
    this.route.paramMap.subscribe(params => {
      this.Id = parseInt(params.get('id'));
      console.log('El ID que llega es: ' + this.Id);

      if (this.Id !== null) {
        this.productService.getProduct(this.Id).subscribe(data => {
          this.producto = data;
          this.Categoria = data.categoria;
          this.enCarrito = this.carritoService.productoEnCarrito(this.Id);
          console.log(this.producto);
        });
      }
    });

    // Suscríbete al observable para actualizar el estado del carrito
    this.carritoService.carritoProductos$.subscribe(productos => {
      this.enCarrito = this.carritoService.productoEnCarrito(this.Id);
    });
  }

  agregarAlCarrito() {
    this.carritoService.agregarProducto(this.producto);
    this.formValidation.mensajeExito('Producto agregado con éxito al carrito', 'Agregar');
  }
}
