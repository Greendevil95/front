import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-accept-status',
  templateUrl: './accept-status.component.html',
  styleUrls: ['./accept-status.component.scss']
})
export class AcceptStatusComponent implements OnInit {
  reservations: Array<any>;
  selectedPage: number;
  pagesCount: number;
  rating: any;
  comment: any;
  count: number;

  constructor(private router: Router, private httpService: HttpService) { }
  
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

  ngOnInit() {
    this.httpService.get('organizations/reservations/auth?field=dateTime.asc&page=' + localStorage.getItem('orgPage')).subscribe(
      data => {
		this.count = data.numberOfElements;
        this.selectedPage = data.number;
        this.pagesCount = data.totalPages;
        this.reservations = data.content;
		this.getDate(data.content);
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

  goToPage(index: number, key: string) {
    localStorage.setItem(key, (index - 1).toString());
    this.ngOnInit();
  }

  changePage(page: number) {
    if (localStorage.getItem('page') === '0' && page === -1) {
      return;
    } else {
      localStorage.setItem('orgPage', (Number(localStorage.getItem('orgPage')) + page).toString());
    }
    this.ngOnInit();
  }
  
  assept(id: string, date: string): void {
	  for (var i: number = 0; i < this.count; i++) {
		  if (this.reservations[i].dateTime === date && this.reservations[i].id !== id && this.reservations[i].status === 'В ожидании') {
			  this.deny(this.reservations[i].id);
		  }
	  }
	  this.httpService.put('reservations/' + id + '/status?status=accepted', null).subscribe(
	  data => {},
        error => {
          if (error.status === 200) {
            console.log('успешно одобрил');
            this.ngOnInit();
          }
    });
  }

  deny(id: string): void {
	  this.httpService.put('reservations/' + id + '/status?status=ownerreject', null).subscribe(
	  data => {},
      error => {
        if (error.status === 200) {
          console.log('успешно отклонил');
          this.ngOnInit();
        }
    });
  }
}
