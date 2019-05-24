import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
	user: any;
	changedPass: boolean = false;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
  }
  
  getPass(): string {
    return localStorage.getItem('password');
  }
  
  changeProfile(name1: string, email1: string, phone1: string): void {
    console.log(name1 + ' ' + email1 + ' ' + phone1);
    if (email1 != null) {
      // localStorage.setItem('email', email1);
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
      rating: this.user.rating,
      password: localStorage.getItem('password')
    }).subscribe(
      data => {
      },
      error => {
        if (error.status === 200) {
          if (email1 !== localStorage.getItem('email')) {
            localStorage.setItem('email', email1);
          }
          this.ngOnInit();
        }
      });
  }

  changePassword(newPass: string): void {
    if (newPass == null) {
      this.changedPass = true;
    } else {
      this.changedPass = false;
      this.httpService.put('/users', {
        id: localStorage.getItem('id'),
        email: this.user.email,
        name: this.user.name,
        phone: this.user.phone,
        rating: this.user.rating,
        password: newPass
      }).subscribe(
        data => {
        },
        error => {
          if (error.status === 200) {
            localStorage.setItem('password', newPass);
            this.ngOnInit();
            newPass = null;
          }
        });
    }
  }
  
  createRange(count: number): number[] {
    let array: number[] = [];
    for (let i = 1; i <= count; i++) {
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

}
