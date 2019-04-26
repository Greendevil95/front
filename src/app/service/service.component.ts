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

viewDate: Date = new Date();

events: CalendarEvent[] = [
    {
      title: 'Свободно',
      start: new Date()
    },
    {
      title: 'Занято',
      start: new Date()
    }
  ];

  eventClicked({ event }: { event: CalendarEvent }): void {
      console.log('Event clicked', event);
    }
}
