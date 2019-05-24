import {AfterContentInit, ChangeDetectionStrategy, Component, Inject, OnChanges, OnInit} from '@angular/core';

import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent,
  CalendarView
} from 'angular-calendar';
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
import {Observable, of, Subject} from "rxjs";
import {HttpParams,HttpClient} from "@angular/common/http";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AboutUsComponent} from "../about-us/about-us.component";
import {LoginComponent} from "../login/login.component";
import {OrgListComponent} from "../org-list/org-list.component";
import {UserComponent} from "../user/user.component";
import {map} from "rxjs/operators";
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
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
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

      .bg-red {
        background-color: #ff624c !important;
      }

      .bg-green {
        background-color: #dcfdda !important;

      }

      .bg-yellow {
        background-color: #fff66d !important;
      }

    `
  ]
})


export class CalendarComponent implements OnInit{


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
        this.httpService.get('/services/' + localStorage.getItem('servId') + '/reservations' + '?pagesize=999').subscribe(
          data => {
            this.reservations=<Reservation[]>data.content;
            for(let i = 0;i<this.reservations.length;i++) {
              this.addEvent2(new Date(this.reservations[i].dateTime), this.reservations[i].status, this.reservations[i].id,this.reservations[i].user.id);
            }
          });
      });


    this.httpService.get('/services/' + localStorage.getItem('servId')).subscribe(
      data => {
        this.service = <Service>data;
        console.log(this.service.time);
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

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach(day => {
      const eventTitle = day.events.length;
      if (eventTitle == this.endOfDay-this.startOfDay+1) {
        day.cssClass = 'bg-red';
      } else if (eventTitle >= (this.endOfDay-this.startOfDay+1)/2){
        day.cssClass = 'bg-yellow';}
      else /*if (eventTitle > 0 && eventTitle < (this.endOfDay-this.startOfDay+1)/2)*/
      {day.cssClass = 'bg-green'}
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
        cssClass: 'my-custom-class'
      }
    ];
  }

  addEvent2(hourDate: Date,status:string, id:number, userId?: any): void {
    if (status == 'INPROCESS'){
      if (this.user.id == userId) {
        this.events = [
          ...this.events,
          {
            title: "Ожидает подтверждения...",
            start: hourDate,
            end: new Date(hourDate.getTime() + (this.service.time* 60 * 1000-1)),
            color: colors.blue,
            cssClass: 'my-custom-class',
            id: id,
          }
        ];
      } else {
        this.events = [
        ...this.events,
        {
          title: "Подтверждается",
          start: hourDate,
          end: new Date(hourDate.getTime() + (this.service.time* 60 * 1000-1)),
          color: colors.yellow,
          cssClass: 'my-custom-class',
          id: id,

        }
      ];}
    }
    else if (status == 'ACCEPTED'){
      if (this.user.id == userId) {
        this.events = [
          ...this.events,
          {
            title: "Запись подтверждена!",
            start: hourDate,
            end: new Date(hourDate.getTime() + (this.service.time* 60 * 1000-1)),
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
            end: new Date(hourDate.getTime() + (this.service.time* 60 * 1000-1)),
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
    if (this.org.user.id != this.user.id && eventDate >= new Date()) {
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
            this.events.length = 0;
            this.ngOnInit();
          }
        });
      /*eventDate.setHours(eventDate.getHours() - 3);
     this.addEvent(eventDate);*/
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
    if (res != undefined) {
      if (this.org.user.id == this.user.id || res.user.id == this.user.id) {
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
    } else  this.events = this.events.filter(event => event !== eventToDelete);

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

@Component({
  selector: 'DeleteReservation',
  templateUrl: 'DeleteReservation.html',
})
export class DeleteReservation {

  /*constructor(
    public dialogRef: MatDialogRef<DeleteReservation>,
    @Inject(MAT_DIALOG_DATA) public data: Reservation) {}

  onNoClick(): void {
    this.dialogRef.close();
  }*/

}
