import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, listaClientes } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  APIURL=environment.APIURL;
  constructor(private http: HttpClient,) { }

  getClientes():Observable<listaClientes>{
    return this.http.get<listaClientes>(`${this.APIURL}/usuario`)
  }

  getCliente(id:number):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.APIURL}/usuario/${id}`)
  }

  postCliente(cliente:Cliente):Observable<void>{
    return this.http.post<void>(`${this.APIURL}/usuario/`,cliente)
  }

  updateCliente(id:number,cliente:Cliente):Observable<void>{
    return this.http.put<void>(`${this.APIURL}/usuario/${id}`,cliente)
  }

  postClienteLogin(cliente:Cliente):Observable<void>{
    return this.http.post<void>(`${this.APIURL}/usuario/Login`,cliente)
  }


}
