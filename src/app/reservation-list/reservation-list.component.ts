import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  reservations: any;
  resPagesCount: number;
  selectedPage: string;
  rating: any;
  comment: any;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.httpService.getAll('/users/reservations' + '?page=', Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        this.resPagesCount = data.totalPages;
        this.reservations = data.content;
        this.selectedPage = data.number;
      });
  }

  createRange(count: number): number[] {
    var array: number[] = [];
    for (var i = 1; i <= count; i++) {
      array.push(i);
    }
    return array;
  }

  goToPage(index: number) {
    localStorage.setItem('resPage', (Number(index.toString()) - 1).toString());
    this.ngOnInit();
  }

  changePage(page: number) {
    if (localStorage.getItem('resPage') === '0' && page === -1) {
      return;
    } else {
      localStorage.setItem('resPage', (page - 1).toString());
    }
    this.ngOnInit();
  }

  /*navigate(id: string): void {
    localStorage.setItem('resPage', '0');
    localStorage.setItem('orgId', id);
    this.router.navigateByUrl('/organization');
  }*/

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

}
