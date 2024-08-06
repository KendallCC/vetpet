import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Horario, ListarHorarios } from '../interfaces/horario';

@Injectable({
  providedIn: 'root'
})
export class HorariobloqueoService {
  APIURL=environment.APIURL;
  
  constructor(private http: HttpClient) {}


  getHorariosYBloqueosPorSucursal(idSucursal: number): Observable<ListarHorarios> {
    return this.http.get<ListarHorarios>(`${this.APIURL}/horario/horariosBloqueos/${idSucursal}`);
  }

  getDetalleHorario(id: number): Observable<Horario> {
    return this.http.get<any>(`${this.APIURL}/horario/${id}`);
  }

  createHorario(horario: Horario): Observable<void> {
    return this.http.post<void>(`${this.APIURL}/horario`,horario);
  }

  createBloqueo(horario: Horario): Observable<void> {
    return this.http.post<void>(`${this.APIURL}/horario/bloqueos`,horario);
  }


}
