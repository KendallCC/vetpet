import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../share/services/product.service';
import { ListaProductos } from '../../share/interfaces/product';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lista-prod-clientes',
  templateUrl: './lista-prod-clientes.component.html',
  styleUrl: './lista-prod-clientes.component.css'
})
export class ListaProdClientesComponent implements OnInit{

Productos:ListaProductos=[];

constructor(private productoService:ProductService, private router:Router) {
  
}
  ngOnInit(): void {
    this.productoService.getProducts().subscribe(data => {
      this.Productos = data;
    });
  }

  Detalle(id){
    this.router.navigate([`productos/${id}`])
  }
  

}
