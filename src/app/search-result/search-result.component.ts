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
  rating: number;

  constructor(private router: Router, private httpService: HttpService) { }

  ngOnInit() {
    this.rating = 0;
    this.pages = 0;
    this.searchString = localStorage.getItem('searchString');
    this.httpService.getAll('/services?search=name:' + this.searchString
      + ',ororganization.name:' + this.searchString
      + ',ordescription:' + this.searchString
      + localStorage.getItem('params')
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

  wideSearch(rating: string, price1: string, price2: string): void {
    var str;
    str = '';
    console.log(rating + ' ' + price1);
    if (rating != null) {
      str += ',andrating:' + rating;
    }
    if (price1 != null && price2 != null) {
      str += ',andprice>' + price1 + ',andprice<' + price2;
    }
    localStorage.setItem('params', str);
    this.ngOnInit();
  }

  navigate(id: string): void {
    localStorage.setItem('orgId', id);
    localStorage.setItem('orgPage', '0');
    this.router.navigateByUrl('/organization');
  }
}
