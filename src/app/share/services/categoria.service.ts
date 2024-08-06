import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { listaCategoria, Categoria } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {



  APIURL = environment.APIURL;
  constructor(private http: HttpClient) {}

  getCategorias(): Observable<listaCategoria> {
    return this.http.get<listaCategoria>(`${this.APIURL}/Categoria`);
  }

  getCategoria(Id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.APIURL}/Categoria/${Id}`);
  }

  postCategoria(Categoria: Categoria): Observable<void> {
    return this.http.post<void>(`${this.APIURL}/Categoria`, Categoria);
  }

  updateCategoria(Id: number, Categoria: Categoria): Observable<void> {
    return this.http.put<void>(`${this.APIURL}/Categoria/${Id}`, Categoria);
  }
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.APIURL}/Categoria/${id}`);
  }

}
