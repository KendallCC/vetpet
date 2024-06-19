import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {listaFactura,Factura} from '../interfaces/factura'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  APIURL=environment.APIURL;
  constructor(private http: HttpClient) { }

  getFacturas():Observable<listaFactura>{
    return this.http.get<listaFactura>(`${this.APIURL}/factura`)
  }
  
  getFactura(Id:number):Observable<Factura>{
    return this.http.get<Factura>(`${this.APIURL}/factura/${Id}`)
  }



}
