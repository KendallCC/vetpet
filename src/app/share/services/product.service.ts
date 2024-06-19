import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ListaProductos,Producto } from '../interfaces/product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
APIURL=environment.APIURL;
  constructor(private http: HttpClient) { }

getProducts():Observable<ListaProductos>{
  return this.http.get<ListaProductos>(`${this.APIURL}/producto`)
}

getProduct(Id:number):Observable<Producto>{
  return this.http.get<Producto>(`${this.APIURL}/producto/${Id}`)
}


}
