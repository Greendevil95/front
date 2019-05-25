import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.scss']
})
export class OrgListComponent implements OnInit {
	reservation: any;
	reservs: Array<any> = Array<any>(2);
  reservations: Array<any>;
  dates: Array<any>;
  count: number;
  resPagesCount: number;
  selectedResPage: string;
  primaryList: Array<any>;
  list: Array<any>;
  userId: number;
  pagesCount: number;
  selectedPage: string = '1';
  category: string = 'all';
  categories: Array<any>;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('category') === '0') {
      localStorage.setItem('category', 'name.asc');
    }
	this.httpService.getAll('/users/reservations?field=dateTime.desc&pagesize=1&page=', Number(localStorage.getItem('resPage'))).subscribe(
      data => {
		this.count = data.numberOfElements;
		this.resPagesCount = data.totalPages;
        this.selectedResPage = data.number;
        this.reservations = data.content;
		this.getDate(data.content);
		this.reservation = this.reservations[0];
		//this.reservs = [this.reservations[1], this.reservations[2]];
		
    });
	/*this.httpService.getAll('/users/reservations?field=dateTime.desc&page=', 0).subscribe(
      data => {
		this.count = data.numberOfElements;
		this.reservations = data.content;
		this.getDate(data.content);
		//this.reservation = this.reservations[0];
		this.reservs = [this.reservations[1], this.reservations[2]];
		
    });*/
	if (localStorage.getItem('id') !== '0') {
	this.userId = Number(localStorage.getItem('id'));
    this.httpService.getAll('/organizations?search=user.vip:true&field='
      + localStorage.getItem('category')
      + '&page=', Number(localStorage.getItem('orgPage'))).subscribe(
      data => {
        this.primaryList = data.content;
      });
    this.httpService.getAll('users/interests/services?field=' + localStorage.getItem('category')
		+ localStorage.getItem('service')
        + '&page=', Number(localStorage.getItem('orgPage'))).subscribe(
        data => {
          this.selectedPage = data.number;
          this.pagesCount = data.totalPages;
          this.list = data.content;
        });
	}
	else {
		this.userId = 0;
		if (Number(localStorage.getItem('orgPage')) % 2 !== 0 && this.selectedPage !== '1'){
			localStorage.setItem('orgPage', (Number(localStorage.getItem('orgPage')) + 1).toString());
		}
		this.httpService.getAll('/organizations/guest?field='
		  + localStorage.getItem('category')
		  + '&page=', Number(localStorage.getItem('orgPage'))).subscribe(
		  data => {
			this.primaryList = data.content;
		});
		this.httpService.getAll('organizations/guest?field=' + localStorage.getItem('category')
			+ '&page=', Number(localStorage.getItem('orgPage')) + 1).subscribe(
			data => {
			  this.selectedPage = (Number(data.number) -1).toString();
			  if (Number(data.totalPages)%2 !== 0) {
				this.pagesCount = Number(data.totalPages)/2 + 1;
			  } else {
				this.pagesCount = Number(data.totalPages)/2;  
			  }
			  this.list = data.content;
        });
	}
  }
  
  getDate(reservations: Array<any>): void {
	  this.dates = Array<any>(this.count);
	  var i: number;
	  for (i = 0; i < this.count; i++) {
		  this.reservations[i].status = this.translateStatus(reservations[i].status);
		  this.dates[i] = reservations[i].dateTime;
		  var res = reservations[i].dateTime.split('T', 2);
		  var data = res[0].split('-', 3);
		  var time = res[1].split(':', 2);
		  this.reservations[i].dateTime = data[2].toString() + '.' + data[1].toString() + '.' + data[0].toString() + ' ' + time[0].toString() + ':' + time[1].toString(); 
		}
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

  createRange(count: number): number[] {
    var array: number[] = [];
    for (var i = 1; i <= count; i++) {
      array.push(i);
    }
    return array;
  }
  
  selectService(category: string): void {
	  this.category = category;
	  if (this.category === 'all') {
		localStorage.setItem('service', '');  
	  } else {
		localStorage.setItem('service', '&search=category:' + category);
	  }
	  this.ngOnInit();
  }

  sort(category: string): void {
    if (category == 'name') {
      localStorage.setItem('category', category + '.asc');
    } else {
      localStorage.setItem('category', category + '.desc');
    }
    this.ngOnInit();
  }

  goToPage(index: number, key: string) {
    localStorage.setItem(key, (index - 1).toString());
    this.ngOnInit();
  }

  changePage(page: number, key: string) {
	if (localStorage.getItem(key) === '0' && page === -1) {
      return;
    } else {
		localStorage.setItem(key, (page + 1).toString());      
    }
    this.ngOnInit();
  }

  navigate(id: string): void {
    localStorage.setItem('orgId', id);
    localStorage.setItem('orgPage', '0');
	localStorage.setItem('resPage', '0');
    this.router.navigateByUrl('/organization');
  }
}
