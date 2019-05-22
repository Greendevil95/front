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

  constructor(private router: Router, private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.get('organizations/reservations/auth?page=' + localStorage.getItem('orgPage')).subscribe(
      data => {
        this.selectedPage = data.number;
        this.pagesCount = data.totalPages;
        this.reservations = data.content;
      }
    );
  }
  
  getDate(date:string): string {
	  console.log(date);
	  var res = date.split('T', 2);
	  var data = res[0].split('-', 3);
	  var time = res[1].split(':', 2);
	  return data[2].toString() + '.' + data[1].toString() + '.' + data[0].toString() + ' ' + time[0].toString() + ':' + time[1].toString();
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
  
  assept(id: string): void {
	  this.httpService.put('reservations/' + id + '/status?status=assepted', null).subscribe(
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
