import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  APIURL = environment.APIURL;
  constructor(private http: HttpClient) {}

  getObtenerCitasPorSucursalHoy(): Observable<any> {
    return this.http.get<any>(`${this.APIURL}/reportes/obtenerCitasPorSucursalHoy`);
  }

  getObtenerTopServiciosVendidos(): Observable<any> {
    return this.http.get<any>(`${this.APIURL}/reportes/obtenerTopServiciosVendidos`);
  }

  getObtenerTopProductosVendidos(): Observable<any> {
    return this.http.get<any>(`${this.APIURL}/reportes/obtenerTopProductosVendidos`);
  }
  
}
