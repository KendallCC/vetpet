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

}
