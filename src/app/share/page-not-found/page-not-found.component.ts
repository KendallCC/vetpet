import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit(): void { }
  irInicio() {
  // Redireccionar a la ruta raíz
  this.router.navigate(['/login']);
  }
  
}
