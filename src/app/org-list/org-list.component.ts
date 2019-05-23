import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.scss']
})
export class OrgListComponent implements OnInit {
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
	this.httpService.get('/other/category').subscribe(
	data => {
		this.categories = data;
	});
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

  createRange(count: number): number[] {
    var array: number[] = [];
    for (var i = 1; i <= count; i++) {
      array.push(i);
    }
    return array;
  }
  
  selectService(category: string): void {
	  this.category = category;
	  console.log('category');
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

  changePage(page: number) {
    if (localStorage.getItem('orgPage') === '0' && page === -1) {
      return;
    } else {
      localStorage.setItem('orgPage', (Number(localStorage.getItem('orgPage')) + page).toString());
    }
    this.ngOnInit();
  }

  navigate(id: string): void {
    localStorage.setItem('orgId', id);
    localStorage.setItem('orgPage', '0');
    this.router.navigateByUrl('/organization');
  }
}
