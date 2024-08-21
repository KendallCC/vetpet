import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CitasService } from '../../../share/services/citas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AgregarCitaModalComponent } from '../agregar-cita-modal/agregar-cita-modal.component';
import { CarritoService } from '../../../share/services/carrito.service';

@Component({
  selector: 'app-agenda-citas',
  templateUrl: './agenda-citas.component.html',
  styleUrls: ['./agenda-citas.component.css'],
})
export class AgendaCitasComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, interactionPlugin],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [],
    businessHours: [],
    validRange: {
      start: new Date(), // Bloquear fechas anteriores a hoy
    },
    selectable: true,
    selectMirror: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventOverlap: false,
    selectConstraint: 'businessHours',
    eventConstraint: 'businessHours',
  };

  constructor(
    private citasService: CitasService,
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCalendarData();
  }

  loadCalendarData(): void {
    const usuario = this.carritoService.obtenerusuario();
    const idUsuario = parseInt(usuario.id, 10);
    const now = new Date();

    // Agregar un evento "background" para las horas anteriores a la hora actual
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const events = [
      {
        title: 'Horas Pasadas',
        start: startOfToday.toISOString(),
        end: now.toISOString(),
        display: 'background',
        backgroundColor: '#ff9e9e', // Color de fondo para las horas pasadas
      },
    ];

    this.citasService.obtenerCitasHorariosYBloqueos(idUsuario).subscribe(
      (data) => {
        const { horariosLaborales, citas, bloqueos } = data;

        this.calendarOptions = {
          ...this.calendarOptions,
          businessHours: horariosLaborales,
          events: [...events, ...citas, ...bloqueos], // Agregar eventos de bloqueos y citas
        };
      },
      (error) => {
        console.error('Error al cargar los datos del calendario:', error);
      }
    );
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    const usuario = this.carritoService.obtenerusuario();
    const now = new Date();

    // Verificar si la fecha y hora seleccionada es anterior a la actual
    if (selectInfo.start < now) {
      console.log('No se pueden registrar citas en una hora anterior a la actual.');
      return;
    }

    const overlappingEvent = selectInfo.view.calendar.getEvents().find(event => {
      return (
        event.extendedProps['esCitaPropia'] !== true && // Excluir las propias citas del cliente
        event.start < selectInfo.end &&
        selectInfo.start < event.end // Verifica la superposición
      );
    });

    if (!overlappingEvent && usuario.rol === 'cliente') {
      const fecha = selectInfo.start;
      const dialogRef = this.dialog.open(AgregarCitaModalComponent, {
        width: '500px',
        data: {
          fecha: fecha,
          hora: fecha.toTimeString().split(' ')[0],
          idCliente: usuario.id,
          nombreCliente: usuario.nombre,
          correoCliente: usuario.correo_electronico,
          idSucursal: usuario.id_sucursal,
          servicioId: this.route.snapshot.queryParams['servicioId'] || null,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadCalendarData();
        }
      });
    } else {
      console.log('El horario seleccionado ya está ocupado.');
    }
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const usuario = this.carritoService.obtenerusuario();
    const evento = clickInfo.event;

    if (evento.extendedProps['idFactura']) {
      this.router.navigate([`detalleCita/${evento.extendedProps['idFactura']}`]);
    }
  }
}
