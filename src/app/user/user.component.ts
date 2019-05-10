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
  orgPagesCount: number;
  selectedOrgPage: string;
  resPagesCount: number;
  selectedResPage: string;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.httpService.get('/users/auth').subscribe(
      data => {
        this.user = data;
      });

    this.httpService.getAll('/users/organizations' + '?page=', Number(localStorage.getItem('orgPage'))).subscribe(
      data => {
        this.orgPagesCount = data.totalPages;
        this.selectedOrgPage = data.number;
        this.organizations = data.content;
      });
    this.httpService.getAll('/users/reservation' + '?page=', Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        this.resPagesCount = data.totalPages;
        this.selectedResPage = data.number;
        this.reservations = data.content;
      });

  }

  changeProfile(name1: string, email1: string, phone1: string): void {
    console.log(name1 + ' ' + email1 + ' ' + phone1);
    if (email1 != null) {
      localStorage.setItem('email', email1);
    } else {
      email1 = this.user.email;
    }
    if (name1 == null) {
      name1 = this.user.name;
    }
    if (phone1 == null) {
      phone1 = this.user.phone;
    }
    this.httpService.put('/users', {
      id: localStorage.getItem('id'),
      email: email1,
      name: name1,
      phone: phone1,
      password: localStorage.getItem('password')
    }).subscribe(
      data => {},
      error => {
        if (error.status === 200) {
          console.log(error);
          this.ngOnInit();
        }
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
    localStorage.setItem(key, (Number(index.toString()) - 1).toString());
    this.ngOnInit();
  }

  changePage(page: number, key: string) {
    if (localStorage.getItem(key) === '0' && page === -1) {
      return;
    } else {
      localStorage.setItem(key, (page - 1).toString());
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
