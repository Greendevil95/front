import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../http/http.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  pages: number;
  results: any;
  searchString: string;
  resCount: number;
  rating: number = 0;
  minPrice: number = 0;
  maxPrice: number = 9999999;
  category: string = 'all';
  categories: Array<any>;

  constructor(private router: Router, private httpService: HttpService) { }

  ngOnInit() {
	//this.rating = 0;
    this.pages = 0;
    this.searchString = localStorage.getItem('searchString');
	this.httpService.get('/other/category').subscribe(
	data => {
		this.categories = data;
	});
	if (this.rating > 0) {
		this.httpService.getAll('/services?search=name:' + this.searchString
      + ',ororganization.name:' + this.searchString
      + ',ordescription:' + this.searchString
	  + ',orcategory:' + this.searchString
	  + localStorage.getItem('service')
	  + ',andrating>' + this.rating
	  + ',andprice>' + this.minPrice
	  + ',andprice<' + this.maxPrice
      + '&page=', Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        if (Number(data.totalPages) > 1) {
          this.resCount = (Number(data.totalPages) - 1) * Number(data.size) + Number(data.numberOfElements);
        } else {
          this.resCount = Number(data.numberOfElements);
        }
        this.pages += data.totalPages;
        this.results = data.content;
      });
	} else {
		this.httpService.getAll('/services?search=name:' + this.searchString
      + ',ororganization.name:' + this.searchString
      + ',ordescription:' + this.searchString
	  + ',orcategory:' + this.searchString
	  + localStorage.getItem('service')
	  + ',andprice>' + this.minPrice
	  + ',andprice<' + this.maxPrice
      + '&page=', Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        if (Number(data.totalPages) > 1) {
          this.resCount = (Number(data.totalPages) - 1) * Number(data.size) + Number(data.numberOfElements);
        } else {
          this.resCount = Number(data.numberOfElements);
        }
        this.pages += data.totalPages;
        this.results = data.content;
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

  search(findString: string): void {
    localStorage.setItem('searchString', findString);
    this.ngOnInit();
  }
  
  selectService(category: string): void {
	  this.category = category;
	  console.log('category');
	  if (this.category === 'all') {
		localStorage.setItem('service', '');  
	  } else {
		localStorage.setItem('service', ',andcategory:' + category);
	  }
	  this.ngOnInit();
  }

  wideSearch(rating: string, price1: string, price2: string): void {
    var str = '';
	console.log(rating + ' ' + price1 + '' + price2);
    if (rating != null) {
		this.rating = Number(rating);
    } else {
		this.rating = 0;
	}
	if (price1 != null) {
		this.minPrice = Number(price1);
	} else {
		this.minPrice = 0;
	}
	if (price2 != null) {
		this.maxPrice = Number(price2);
	} else {
		this.maxPrice = 9999999;
	}
    this.ngOnInit();
  }

  navigate(id: string): void {
    localStorage.setItem('orgId', id);
    localStorage.setItem('orgPage', '0');
    this.router.navigateByUrl('/organization');
  }
}
