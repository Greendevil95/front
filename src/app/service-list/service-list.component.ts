import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  organization: any;
  userId: string;
  list: Array<any>;
  pagesCount: number;
  selectedPage: string;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.httpService.get('/organizations/' + localStorage.getItem('orgId')).subscribe(
      data => {
        this.organization = data;
      });
    this.userId = localStorage.getItem('id');
    this.httpService.getAll('/organizations/' + localStorage.getItem('orgId') + '/services' + '?page=', Number(localStorage.getItem('servPage'))).subscribe(
      data => {
        console.log(data);
        this.pagesCount = data.totalPages;
        this.selectedPage = data.number;
        this.list = data.content;
      });
  }

  createReservation(id1: string) {
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
          localStorage.setItem('servPage', '0');
          this.router.navigateByUrl('/organization');
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

  createRange(count: number): number[] {
    var array: number[] = [];
    for (var i = 1; i <= count; i++) {
      array.push(i);
    }
    return array;
  }

  changePage(page: number) {
    if (localStorage.getItem('servPage') === '0' && page === -1) {
      return;
    } else {
      localStorage.setItem('servPage', (Number(localStorage.getItem('servPage')) + page).toString());
    }
    this.ngOnInit();
  }

  navigate(id: string): void {
    localStorage.setItem('servId', id);
    localStorage.setItem('servPage', '0');
    this.router.navigateByUrl('servicepage');
  }

  navigate1(id: string): void {
    localStorage.setItem('servId', id);
    localStorage.setItem('servPage', '0');
    this.router.navigateByUrl('calendar');
  }

}
