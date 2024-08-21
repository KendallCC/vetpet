import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ReportesService } from '../../share/services/reportes.service';
import { Chart, ChartItem,registerables  } from 'chart.js';

@Component({
  selector: 'app-reportes-administrador',
  templateUrl: './reportes-administrador.component.html',
  styleUrl: './reportes-administrador.component.css'
})
export class ReportesAdministradorComponent implements OnInit {
  @ViewChild('citasSucursalCanvas', { static: true }) citasSucursalCanvas!: ElementRef;
  @ViewChild('topServiciosCanvas', { static: true }) topServiciosCanvas!: ElementRef;
  @ViewChild('topProductosCanvas', { static: true }) topProductosCanvas!: ElementRef;

  constructor(private reportesService: ReportesService) {
    // Registrar los componentes necesarios de Chart.js
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.renderCitasPorSucursalHoy();
    this.renderTopServiciosVendidos();
    this.renderTopProductosVendidos();
  }

  renderCitasPorSucursalHoy() {
    this.reportesService.getObtenerCitasPorSucursalHoy().subscribe((data: any[]) => {
      const labels = data.map(d => d.nombre_sucursal);
      const citasData = data.map(d => d.cantidad_citas);

      const ctx = this.citasSucursalCanvas.nativeElement.getContext('2d') as ChartItem;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Citas por Sucursal',
            data: citasData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  renderTopServiciosVendidos() {
    this.reportesService.getObtenerTopServiciosVendidos().subscribe((data: any[]) => {
      const labels = data.map(d => d.nombre_servicio);
      const serviciosData = data.map(d => d.cantidad_vendida);

      const ctx = this.topServiciosCanvas.nativeElement.getContext('2d') as ChartItem;
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Top Servicios Vendidos',
            data: serviciosData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true
        }
      });
    });
  }

  renderTopProductosVendidos() {
    this.reportesService.getObtenerTopProductosVendidos().subscribe((data: any[]) => {
      const labels = data.map(d => d.nombre_producto);
      const productosData = data.map(d => d.cantidad_vendida);

      const ctx = this.topProductosCanvas.nativeElement.getContext('2d') as ChartItem;
      new Chart(ctx, {
        type: 'bar', // Cambiado a 'bar'
        data: {
          labels: labels,
          datasets: [{
            label: 'Top Productos Vendidos',
            data: productosData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y', // Configurado para barras horizontales
          scales: {
            x: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }
}
