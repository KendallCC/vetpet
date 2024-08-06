import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListaMascota, Mascota } from '../interfaces/mascota';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  APIURL=environment.APIURL;
  constructor(private http: HttpClient) { }

  getMascotas():Observable<ListaMascota>{
    return this.http.get<ListaMascota>(`${this.APIURL}/mascota/`)
  }

  getMascota(id:number):Observable<Mascota>{
    return this.http.get<Mascota>(`${this.APIURL}/mascota/${id}`)
  }
 
  getMascotasClientes(id:number):Observable<ListaMascota>{
    return this.http.get<ListaMascota>(`${this.APIURL}/mascota/cliente/${id}`)
  }
  // postMascota(Mascota:Mascota):Observable<void>{
  //   return this.http.post<void>(`${this.APIURL}/usuario/`,Mascota)
  // }

  // updateMascota(id:number,Mascota:Mascota):Observable<void>{
  //   return this.http.post<void>(`${this.APIURL}/usuario/${id}`,Mascota)
  // }

  
}
