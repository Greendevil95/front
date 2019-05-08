import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  service: any;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.httpService.get('/service/' + localStorage.getItem('servId')).subscribe(
      data => {
      this.service = data;
      console.log(data);
    });
  }

  reserve(id1: string) {
    this.httpService.post('/reservations', {
      comment: '',
      rating: -1,
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
          this.router.navigateByUrl('/organization');
        }
      });
  }

locale: string = 'ru';

viewDate: Date = new Date();

events: CalendarEvent[] = [
    {
      title: 'Свободно',
      color: colors.blue,
      start: new Date()
    },
    {
      title: 'Занято',
      color: colors.red,
      start: new Date()
    }
  ];

  eventClicked({ event }: { event: CalendarEvent }): void {
      console.log('Event clicked', event);
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
  }
};
