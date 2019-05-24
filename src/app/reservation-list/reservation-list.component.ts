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
  count: number;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.httpService.getAll('/users/reservations' + '?page=', Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        this.count = data.numberOfElements;
        this.resPagesCount = data.totalPages;
        this.selectedPage = data.number;
        this.reservations = data.content;
		this.getDate(data.content);
      });
  }
  
  translateStatus(status: string): string {
	  switch(status) {
		  case 'ACCEPTED': {
			  return 'Одобрено';
			  break;
		  }
		  case 'INPROCESS': {
			  return 'В ожидании';
			  break;
		  }
		  case 'FINISHED': {
			  return 'Выполнено';
			  break;
		  }
		  case 'CUSTOMERREJECT': {
			  return 'Клиент отказал';
			  break;
		  }
		  case 'OWNERREJECT': {
			  return 'Предприниматель отказался';
			  break;
		  }
	  } 
  }
  
  getDate(reservations: Array<any>): void {
	  var i: number;
	  for (i = 0; i < this.count; i++) {
		  this.reservations[i].status = this.translateStatus(reservations[i].status);
		  var res = reservations[i].dateTime.split('T', 2);
		  var data = res[0].split('-', 3);
		  var time = res[1].split(':', 2);
		  this.reservations[i].dateTime = data[2].toString() + '.' + data[1].toString() + '.' + data[0].toString() + ' ' + time[0].toString() + ':' + time[1].toString(); 
		}
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
