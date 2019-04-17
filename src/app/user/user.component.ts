import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  reservations: Array<any>;
  user: any;
  organizations: Array<any>;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.httpService.get('/users/auth').subscribe(
      data => {
        this.user = data;
      });

    this.httpService.getAll('/users/organizations', Number(localStorage.getItem('orgPage'))).subscribe(
      data => {
        console.log(data.content);
        this.organizations = data.content;
      });
    this.httpService.getAll('/users/reservation', Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        this.reservations = data.content;
      });
  }

  changePage(page: number, key: string) {
    if (localStorage.getItem(key) === '0' && page === -1) {
      return;
    } else {
      localStorage.setItem(key, (Number(localStorage.getItem(key)) + page).toString());
    }
    this.ngOnInit();
  }

  navigate(id: string): void {
    localStorage.setItem('orgPage', '0');
    localStorage.setItem('resPage', '0');
    if (Number(id) > -1) {
      localStorage.setItem('orgId', id);
      this.router.navigateByUrl('/organization');
    } else {
      this.router.navigateByUrl('/add-organization');
    }
  }

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
