import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../share/services/product.service';
import { Producto } from '../../share/interfaces/product';
import { Categoria } from '../../share/interfaces/categoria';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent {
Id:number
producto:Producto
Categoria:Categoria
constructor(private route:ActivatedRoute, private productService:ProductService) {
}

ngOnInit(): void {
  // Observa los cambios en el parámetro de ruta 'id'
  this.route.paramMap.subscribe(params => {
    this.Id = parseInt(params.get('id')); 
    console.log('el id que llega es:'+this.Id);
    
    if (this.Id!==null) {
     this.productService.getProduct(this.Id).subscribe(data=>{
      this.producto=data;
      this.Categoria=data.categoria
      console.log(this.producto);
      
      })
    }
  });
}

}
