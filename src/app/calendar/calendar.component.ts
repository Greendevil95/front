import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

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
import {catchError, map} from "rxjs/operators";
import {Config} from "codelyzer";
import {formatDate} from "@angular/common";
import {log} from "util";
import DateTimeFormat = Intl.DateTimeFormat;

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
  organiz:Organization;
  hours: Date;
  user: any;


  constructor(private httpService: HttpService, private router: Router, private http: HttpClient) { }
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
         this.time=this.serv.time;
      });

    this.httpService.get('organizations/' + localStorage.getItem('orgId')).subscribe(
      data => {
        this.org = data;
        this.organiz = <Organization>this.org;
        this.setStartOfDay(this.organiz.startTime);
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

  activeDayIsOpen: boolean = false;

 /* delete(id: string) {
    console.log(id);
    this.httpService.delete('/service' + id).subscribe(
      data => {
        localStorage.setItem('servPage', '0');
        this.router.navigateByUrl('/organization');
      }
    );
  }*/



  refresh: Subject<any> = new Subject();

locale: string = 'ru';


  CalendarView = CalendarView;



  endOfDay = 18;


  weekStartsOn = 1;

  serviceDuration = 1;

  hourSegmentHeight=60/this.serviceDuration;

    setStartOfDay(date:Date): void{
      console.log(date);
    let date2 = new Date('08:00:00');
    this.startOfDay=10;
  }


 /* events1: CalendarEvent[] = [];

  events3 = this.createEvents(this.eventsCount);

  createEvents(eventsCount: number){
    for(let i = 0;i <= eventsCount;i++)
      this.events1.push({
        title: 'Свободно',
        color: colors.green,
        start: new Date("2019-05-03 9:00:00"),
        end: new Date("2019-05-03 10:00:00")
        //         //free: true
      });
    return this.events1
  }*/

  /*fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];



    const params = new HttpParams()
      .set(
        'primary_release_date.gte',
        format(getStart(this.viewDate), 'YYYY-MM-DD')
      )
      .set(
        'primary_release_date.lte',
        format(getEnd(this.viewDate), 'YYYY-MM-DD')
      )
      .set('api_key', '0ec33936a68018857d727958dca1424f');

    this.events$ = this.http
      .get('https://api.themoviedb.org/3/discover/movie', { params })
      .pipe(
        map(({ results }: { results: Film[] }) => { console.log(results);
          return results.map((film: Film) => {
            console.log(film.title);
            return {
              title: film.title,
              start: new Date(
                film.release_date + getTimezoneOffsetString(this.viewDate)
              ),
              color: colors.yellow,
              allDay: true,
              meta: {
                film
              }
            };
          });
        })
      );
  }*/

events: CalendarEvent[] = [
      {
        title: 'Свободно',
        color: colors.green,
        start: new Date("2019-05-03 11:30:00"),
        end: new Date("2019-05-03 12:30:00"),
        id:3
        //free: true
      },
      {
      title: 'Занято',
      color: colors.red,
      start: new Date("2019-05-03 12:30:00"),
      end: new Date("2019-05-03 13:30:00"),
        id: 1
      //free: false
    },
    {
      title: 'Занято',
      color: colors.red,
      start: new Date("2019-05-04 13:30:00"),
      end: new Date("2019-05-04 14:30:00"),
      id: 2
      //free: false
    },
    {
      title: 'Подтверждается',
      color: this.setColor('Подтверждается'),
      start: new Date("2019-05-04 12:30:00"),
      end: new Date("2019-05-04 13:30:00")
      //free: false
    }
  ];



  /*dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }*/

   getTimezoneOffsetString(date: Date): string {
    const timezoneOffset = date.getTimezoneOffset();
    const hoursOffset = String(
      Math.floor(Math.abs(timezoneOffset / 60))
    ).padStart(2, '0');
    const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
    const direction = timezoneOffset > 0 ? '-' : '+';

    return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
  }

  setColor(title: String){
    if (title == 'Свободно')
      return colors.green;
    if (title == 'Занято')
      return colors.red;
    else return colors.yellow
  }

  /*activeDayIsOpen: boolean = true;*/

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
          id:id

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
