import { Component, OnInit } from '@angular/core';
import {CustomDateFormatter} from "../calendar/custom-date-formatter.provider";
import {HttpService} from "../http/http.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {Subject} from "rxjs";
import {endOfHour, startOfHour} from "date-fns";
import {DeleteReservation} from "../calendar/calendar.component";
import {CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView} from 'angular-calendar';
import {ViewEncapsulation} from "@angular/cli/lib/config/schema";

interface User{
  id: number;

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
  service:[
    {name:string;
    time:any;}
    ]
  user:[
    {id:number}
    ]
}

interface Organization {
  id: number;
  startTime: Date;
  finishTime:Date;
  user:[
    {id:number}
    ]
}

@Component({
  selector: 'app-user-calendar',
  templateUrl: './user-calendar.component.html',
  styleUrls: ['./user-calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
    ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .my-custom-class span {
        color: #000000 !important;
        font-size: 10.5pt;
      }
    `
  ]
})
export class UserCalendarComponent implements OnInit {

  organization: any;
  userId: string;
  list: Array<any>;
  pagesCount: number;
  role: string;
  reservations: Array<any>;
  clickedDate: number;
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  service:any;
  org:any;
  output: string;
  res:Reservation[];
  time:number;
  startOfDay:number;
  endOfDay:number;
  hourSegmentHeight: number;
  serviceDuration: number;
  hours: Date;
  user: any;
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;



  constructor(private httpService: HttpService, private router: Router, public dialog: MatDialog) { }
  //constructor(private http: HttpClient) {}


  ngOnInit():void {
    this.httpService.get('/users/auth').subscribe(
      data => {
        this.user = <User>data;
        console.log(this.user.id);
        this.httpService.get('/users/' + this.user.id + '/reservations' + '?pagesize=999').subscribe(
          data => {
            this.reservations=<Reservation[]>data.content;
            console.log(this.reservations);
            for(let i = 0;i<this.reservations.length;i++) {
              this.addEvent2(new Date(this.reservations[i].dateTime), this.reservations[i].status, this.reservations[i].id, this.reservations[i].service.time,this.reservations[i].user.id,this.reservations[i].service.name);
            }
          });
      });


    this.httpService.get('/services/' + localStorage.getItem('servId')).subscribe(
      data => {
        this.service = <Service>data;
        this.serviceDuration = 60/this.service.time;
        this.hourSegmentHeight=60/this.serviceDuration;

      });

    this.httpService.get('organizations/' + localStorage.getItem('orgId')).subscribe(
      data => {
        this.org = <Organization>data;
        this.startOfDay = parseInt(this.org.startTime.toString(),10);
        this.endOfDay = parseInt(this.org.finishTime.toString(),10);
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
      comment: comment1

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
    this.httpService.delete('/services' + id).subscribe(
      data => {
        localStorage.setItem('servPage', '0');
        this.router.navigateByUrl('/organization');
      }
    );
  }

  openDialog(): void {
    this.dialog.open(DeleteReservation)
  }

  refresh: Subject<any> = new Subject();

  locale: string = 'ru';


  CalendarView = CalendarView;

  eventWidth = 1495;

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
        title: "Ожидает подтверждения...",
        start: startOfHour(hourDate),
        end: endOfHour(hourDate),
        color: colors.blue,
        id: null,
        cssClass: 'my-custom-class'
      }
    ];
  }

  addEvent2(hourDate: Date,status:string, id:number, resCount: any, userId?: any, servName?: any): void {
    console.log(resCount);
    if (status == 'INPROCESS'){
      if (this.user.id == userId) {
        this.events = [
          ...this.events,
          {
            title: servName,
            start: hourDate,
            end: new Date(hourDate.getTime() + (resCount* 60 * 1000-1)),
            color: colors.blue,
            id: id,
            cssClass: 'my-custom-class'
          }
        ];
      } else {
        this.events = [
          ...this.events,
          {
            title: "Подтверждается",
            start: hourDate,
            end: new Date(hourDate.getTime() + (resCount* 60 * 1000-1)),
            color: colors.yellow,
            id: id,
            cssClass: 'my-custom-class'

          }
        ];}
    }
    else if (status == 'ACCEPTED'){
      if (this.user.id == userId) {
        this.events = [
          ...this.events,
          {
            title: servName,
            start: hourDate,
            end: new Date(hourDate.getTime() + (resCount* 60 * 1000-1)),
            color: colors.green,
            id: id,
            cssClass: 'my-custom-class'
          }
        ];
      } else {
        this.events = [
          ...this.events,
          {
            title: "Забронировано",
            start: hourDate,
            end: new Date(hourDate.getTime() + (resCount* 60 * 1000-1)),
            color: colors.red,
            id: id,
            cssClass: 'my-custom-class'
          }
        ];}
    }
  }

  refreshView(): void {
    this.refresh.next();
  }

  reserve(id1: string,eventDate: Date) {
    if (this.org.user.id != this.user.id) {
      eventDate.setUTCHours(eventDate.getHours());
      this.httpService.post('/reservations', {
        comment: "",
        rating: -1,
        dateTime: eventDate,
        service: {
          id: id1
        },
        organization: {
          id: localStorage.getItem('orgId')
        }
      }).subscribe(data => {
        },
        error => {
          if (error.status === 200) {
            console.log(error);
            //this.router.navigateByUrl('/organization');
          }
        });
      eventDate.setHours(eventDate.getHours() - 3);
      this.addEvent(eventDate);
    } else console.log('Try reserv in own organisation!')
  }

  contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].user.id === elem) {
        console.log(arr[i].user.id + " + " + elem);
        return true;
      }
    }
    return false;
  }


  deleteReservation(eventId: number,eventToDelete: CalendarEvent): void {
    let res = this.reservations.find(Reservation => Reservation.id  == eventId);
    if (this.org.user.id == this.user.id || res.user.id == this.user.id || res.id == null){
      this.events = this.events.filter(event => event !== eventToDelete);
      this.httpService.put('reservations/' + eventId + '/status?status=CUSTOMERREJECT', null).subscribe(
        data => {},
        error => {
          if (error.status === 200) {
          }
        });
      this.events.length = 0;
      console.log('успешно отменил');
      this.ngOnInit();
    }
  }

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
  },
  purpure: {
    primary: '#cd1cfd',
    secondary: '#ff8afd'
  }

};


