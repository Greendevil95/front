import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.scss']
})
export class OrgListComponent implements OnInit {
  list: Array<any>;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.httpService.getAll('/organizations', Number(localStorage.getItem('orgPage'))).subscribe(
      data => {
        console.log(data.content);
        this.list = data.content;
      });
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
