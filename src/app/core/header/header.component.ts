import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  constructor(private router: Router) { } 

  ngOnInit(): void {
    
  }

  irAcerca(){
    this.router.navigate(['acerca'])
  }

  irinicio(){
    this.router.navigate(['/'])
  }

  irProducto(){
    this.router.navigate(['productos'])
  }
  
  irFactura(){
    this.router.navigate(['factura'])
  }
  
  irCitasEncargado(){
    this.router.navigate(['listaCitasEncargado'])
  }
  

}
