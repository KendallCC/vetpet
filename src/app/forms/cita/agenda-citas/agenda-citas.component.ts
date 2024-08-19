import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { CitasService } from '../../../share/services/citas.service';
import { AgregarCitaModalComponent } from '../agregar-cita-modal/agregar-cita-modal.component';
import esLocale from '@fullcalendar/core/locales/es';
@Component({
  selector: 'app-agenda-citas',
  templateUrl: './agenda-citas.component.html',
  styleUrls: ['./agenda-citas.component.css'],
})
export class AgendaCitasComponent implements OnInit {
  constructor(private citasService: CitasService, public dialog: MatDialog) {}

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    locale: esLocale,
    dateClick: (arg) => this.openCreateCitaModal(arg),
    events: [],
  };

  ngOnInit(): void {
    this.obtenerCitas();
  }

  openCreateCitaModal(arg): void {
    const user = JSON.parse(localStorage.getItem('user'));
  
    const fecha = new Date(arg.date);
    const hora = fecha.toTimeString().split(' ')[0];
  console.log(user);
  
    const dialogRef = this.dialog.open(AgregarCitaModalComponent, {
      width: '500px',
      data: {
        fecha: fecha,
        hora: hora,
        idCliente: user.id,
        nombreCliente: user.nombre,
        correoCliente: user.correo_electronico,
        idSucursal: user.id_sucursal,
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerCitas();
      }
    });
  }

  obtenerCitas(): void {
    this.citasService.ListarCitasPorSucursalCliente(this.obtenerIdCliente()).subscribe((citas) => {
      const events = citas.map((cita) => ({
        title: cita.motivo,
        start: cita.hora_cita,
        end: cita.duracion 
          ? new Date(new Date(cita.hora_cita).getTime() + cita.duracion * 60000).toISOString() 
          : cita.hora_cita,
        color: this.obtenerColorPorEstado(cita.estado),
      }));

      this.calendarOptions = {
        ...this.calendarOptions,
        events: events
      };
    });
  }

  obtenerIdCliente(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.id || null;
    }
    return null;
  }

  obtenerColorPorEstado(estado: string): string {
    switch (estado) {
      case 'Confirmada':
        return '#1e90ff';
      case 'Pendiente':
        return '#ffcc00';
      case 'Cancelada':
        return '#dc3545';
      case 'Completada':
        return '#28a745';
      default:
        return '#6c757d';
    }
  }
}
