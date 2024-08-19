import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Encargadocita, listaCitas } from '../interfaces/cita';
import { Cita } from '../interfaces/cita';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  APIURL=environment.APIURL;
  constructor(private http: HttpClient,) { 

  }

  getreservasEncargados(Id:number):Observable<Encargadocita>{
    return this.http.get<Encargadocita>(`${this.APIURL}/cita/encargado/${Id}`)
  }

  getCita(Id:number):Observable<Cita>{
    return this.http.get<Cita>(`${this.APIURL}/cita/${Id}`)
  }

  ListarCitasPorSucursalCliente(Id:number):Observable<listaCitas>{
    return this.http.get<listaCitas>(`${this.APIURL}/cita/sucursal/${Id}`)
  }

  postCita(cita:Cita):Observable <void> {
    return this.http.post<void>(`${this.APIURL}/cita/`,cita)
  }

  updateCita(Id:number,cita:Cita):Observable<Cita>{
    return this.http.put<Cita>(`${this.APIURL}/cita/${Id}`,cita)
  }

  deleteCita(Id:number):Observable<Cita>{
    return this.http.delete<Cita>(`${this.APIURL}/cita/${Id}`)
  }

}
