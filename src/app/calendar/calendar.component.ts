import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';

import {CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours, startOfWeek, startOfMonth, endOfWeek, format, startOfHour, endOfHour
} from 'date-fns';
import {HttpService} from "../http/http.service";
import {Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {HttpParams,HttpClient} from "@angular/common/http";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


interface Film {
  id: number;
  title: string;
  release_date: string;
}

interface Service {
  id: number;
  name:string;
  price:number;
  description:string;
  time:number;
}

interface Reservation {
  id: number;
  dateTime: Date;
  comment:string;
  status:string;
}

interface Organization {
  id: number;
  startTime: Date;
  finishTime:Date;
}



@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})


export class CalendarComponent implements OnInit  {

  organization: any;
  userId: string;
  list: Array<any>;
  pagesCount: number;
  role: string;
  reservations: Array<any>;
  clickedDate: number;
  //events$: Observable<Array<CalendarEvent<{ film: Film }>>>;
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  service:any;
  org:any;
  output: string;
  serv:Service;
  res:Reservation[];
  time:number;
  //events$: Observable<Array<CalendarEvent<{ reservation:Reservation }>>>;
  startOfDay:number;
  endOfDay:number;
  hourSegmentHeight: number;
  serviceDuration: number;
  organiz:Organization;
  hours: Date;
  user: any;
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;



  constructor(private httpService: HttpService, private router: Router, public dialog: MatDialog) { }
  //constructor(private http: HttpClient) {}


  ngOnInit():void {
    this.httpService.get('/service/' + localStorage.getItem('servId') + '/reservations' + '?pagesize=999').subscribe(
      data => {
        this.reservations = data.content;
        this.res=<Reservation[]>this.reservations;
        for(let i = 0;i<this.res.length;i++) {
          this.addEvent2(new Date(this.res[i].dateTime), this.res[i].status, this.res[i].id);
        }
      });

    this.httpService.get('/service/' + localStorage.getItem('servId')).subscribe(
      data => {
        this.service = data;
         this.serv =<Service>this.service;
         this.serviceDuration = this.serv.time/60;
        this.hourSegmentHeight=60/this.serviceDuration;
      });

    this.httpService.get('organizations/' + localStorage.getItem('orgId')).subscribe(
      data => {
        this.org = data;
        this.organiz = <Organization>this.org;
        this.startOfDay = parseInt(this.organiz.startTime.toString(),10);
        this.endOfDay = parseInt(this.organiz.finishTime.toString(),10);
      });

    this.httpService.get('/users/auth').subscribe(
      data => {
        this.user = data;
      });

  }


  updateRez(id1: string, servId: string, comment1: string, rating1: string): void {
    this.httpService.put('/reservations', {
      id: id1,
      service: {
        id: servId
      },
      user: {
        id: localStorage.getItem('id')
      },
      rating: rating1,
      comment: comment1,

    }).subscribe(
      data => {},
      error => {
        if (error.status === 200) {
          console.log(error);
          this.ngOnInit();
        }
      });
  }


  delete(id: string) {
    console.log(id);
    this.httpService.delete('/service' + id).subscribe(
      data => {
        localStorage.setItem('servPage', '0');
        this.router.navigateByUrl('/organization');
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteReservation, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  refresh: Subject<any> = new Subject();

  locale: string = 'ru';


  CalendarView = CalendarView;



  weekStartsOn = 1;




  eventClicked({ event }: { event: CalendarEvent }): void {

      console.log('Event clicked', event);
    }

  setView(view: CalendarView) {
    this.view = view;
  }

  addEvent(hourDate: Date): void {
    this.events = [
      ...this.events,
      {
        title: 'Подтверждается',
        start: startOfHour(hourDate),
        end: endOfHour(hourDate),
        color: colors.yellow
      }
    ];
  }

  addEvent2(hourDate: Date,status:string, id:number): void {
    if (status == 'INPROCESS'){
      this.events = [
        ...this.events,
        {
          title: "Подтверждается",
          start: startOfHour(hourDate),
          end: endOfHour(hourDate),
          color: colors.yellow,
          id:id,
         /* actions: [
            {
              label: '<i class="fa fa-fw fa-times"></i>',
              onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                console.log('Event deleted', event);
              }
            }
          ]*/

        }
      ];
    }
    else if (status == 'ASSEPTED'){
      this.events = [
        ...this.events,
        {
          title: "Забронировано",
          start: startOfHour(hourDate),
          end: endOfHour(hourDate),
          color: colors.red,
          id:id
        }
      ];
    }
  }

  refreshView(): void {
    this.refresh.next();
  }

  reserve(id1: string,eventDate: Date) {
    eventDate.setUTCHours(eventDate.getHours());
    this.httpService.post('/reservations', {
      comment: "",
      rating: -1,
      dateTime:eventDate,
      service: {
        id: id1
      },
      organization: {
        id: localStorage.getItem('orgId')
      }
    }).subscribe(data => {},
      error => {
        if (error.status === 200) {
          console.log(error);
          //this.router.navigateByUrl('/organization');
        }
      });
    eventDate.setHours(eventDate.getHours()-3);
    this.addEvent(eventDate);
  }


  deleteReservation(eventId: number,eventToDelete: CalendarEvent): void {
    this.events = this.events.filter(event => event !== eventToDelete);
      this.httpService.delete('/reservations/' + eventId).subscribe(
      data => { },
      error => {
        if (error.status === 200) {
          console.log(error);
        }
      });
  }
  /*closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }*/

}

export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#51FD43',
    secondary: '#B7FDA8'
  }

};

@Component({
  selector: 'DeleteReservation',
  templateUrl: 'DeleteReservation.html',
})
export class DeleteReservation {

  constructor(
    public dialogRef: MatDialogRef<DeleteReservation>,
    @Inject(MAT_DIALOG_DATA) public data: Reservation) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
