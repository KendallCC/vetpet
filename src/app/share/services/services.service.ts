import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { listaServicios, Servicio } from '../interfaces/servicio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {


  APIURL=environment.APIURL;

  constructor(private http: HttpClient) { }


  getServices():Observable<listaServicios>{
    return this.http.get<listaServicios>(`${this.APIURL}/servicio`)
  }
  
  getService(Id:number):Observable<Servicio>{
    return this.http.get<Servicio>(`${this.APIURL}/servicio/${Id}`)
  }
  
  postService(servicio:Servicio):Observable<void>{
    return this.http.post<void>(`${this.APIURL}/servicio`,servicio)
  }

  updateService(Id:number,servicio:Servicio):Observable<void>{
    return this.http.put<void>(`${this.APIURL}/servicio/${Id}`,servicio)
  }

  deleteService(id:number):Observable<void>{
    return this.http.delete<void>(`${this.APIURL}/servicio/${id}`)
  }
}
