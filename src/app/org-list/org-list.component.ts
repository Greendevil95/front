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
  pagesCount: number;
  selectedPage: string;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('category') === '0') {
      localStorage.setItem('category', 'name.asc');
      console.log('tut');
    }
    this.httpService.getAll('users/interests/services?field=organization.' + localStorage.getItem('category')
      + '&page=', Number(localStorage.getItem('orgPage'))).subscribe(
      data => {
        console.log(data.content);
        this.selectedPage = data.number;
        this.pagesCount = data.totalPages;
        this.primaryList = data.content;
      }
    );
    this.httpService.getAll('/organizations?field='
      + localStorage.getItem('category')
      + '&page=', Number(localStorage.getItem('orgPage'))).subscribe(
      data => {
        console.log(data.content);
        this.selectedPage = data.number;
        this.pagesCount = data.totalPages;
        this.list = data.content;
      });
  }

  createRange(count: number): number[] {
    var array: number[] = [];
    for (var i = 1; i <= count; i++) {
      array.push(i);
    }
    return array;
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
