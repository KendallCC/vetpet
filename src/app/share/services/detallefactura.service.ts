
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { DetallesFactura } from '../interfaces/detalle-factura';
@Injectable({
  providedIn: 'root'
})
export class DetallefacturaService {

  APIURL=environment.APIURL;
  constructor(private http: HttpClient) { }

  // getFacturas():Observable<listaFactura>{
  //   return this.http.get<listaFactura>(`${this.APIURL}/factura`)
  // }
  
  getDetallesFactura(Id:number):Observable<DetallesFactura>{
    return this.http.get<DetallesFactura>(`${this.APIURL}/detallefactura/${Id}`)
  }

}
