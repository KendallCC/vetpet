import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private IdEncargadoSubject: BehaviorSubject<Number>;
  public IdEncargado$;


  constructor() { 
    this.IdEncargadoSubject = new BehaviorSubject<Number>(undefined);
    this.IdEncargado$ = this.IdEncargadoSubject.asObservable();
  }

  getVariableGlobal(): Number {
    return this.IdEncargadoSubject.getValue();
  }

  setVariableGlobal(value: Number): void {
    this.IdEncargadoSubject.next(value);
  }

}
