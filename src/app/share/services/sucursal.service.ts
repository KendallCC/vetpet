import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ListaSucursales, Sucursal } from '../interfaces/sucursal';
import { listaClientes } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  APIURL = environment.APIURL;
  constructor(private http: HttpClient) {}

  getSucursales(): Observable<ListaSucursales> {
    return this.http.get<ListaSucursales>(`${this.APIURL}/sucursal`);
  }

  getSucursal(Id: number): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.APIURL}/sucursal/${Id}`);
  }

  getGerentesPorSucursal(Id: number): Observable<listaClientes> {
    return this.http.get<listaClientes>(`${this.APIURL}/sucursal/gerentes/${Id}`);
  }

  getGerentesSinSucursal(): Observable<listaClientes> {
    return this.http.get<listaClientes>(`${this.APIURL}/sucursal/null`);
  }

  postSucursal(Sucursal: Sucursal): Observable<void> {
    return this.http.post<void>(`${this.APIURL}/sucursal`, Sucursal);
  }

  updateSucursal(Id: number, Sucursal: Sucursal): Observable<void> {
    return this.http.put<void>(`${this.APIURL}/sucursal/${Id}`, Sucursal);
  }
  deleteSucursal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.APIURL}/sucursal/${id}`);
  }
}
