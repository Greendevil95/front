import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  organization: any;
  userId: string;
  list: Array<any>;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.httpService.get('/organizations/' + localStorage.getItem('orgId')).subscribe(
      data => {
        this.organization = data;
      });
    this.userId = localStorage.getItem('id');
    this.httpService.getAll('/service', Number(localStorage.getItem('page'))).subscribe( // ?page=' + localStorage.getItem('page')
      data => {
        console.log(data);
        this.list = data.content;
      });
  }

  delete(id: string) {
    console.log(id);
    this.httpService.delete('/service' + id).subscribe(
      data => {
        this.router.navigateByUrl('/organization');
      }
    );
  }

  changePage(page: number) {
    if (localStorage.getItem('page') === '0' && page === -1) {
      return;
    } else {
      localStorage.setItem('page', (Number(localStorage.getItem('page')) + page).toString());
    }
    this.ngOnInit();
  }

  navigate(id: string): void {
    localStorage.setItem('servId', id);
    this.router.navigateByUrl('/service');
  }

}
