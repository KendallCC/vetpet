import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor() {
    const storedUser = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.user = this.userSubject.asObservable();
  }

  get currentUserValue(): any {
    return this.userSubject.value;
  }

  login(userData: any) {
    // Simula el login guardando el usuario en el localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    this.userSubject.next(userData);
  }

  logout() {
    // Simula el logout limpiando el localStorage y el estado del BehaviorSubject
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }
}
