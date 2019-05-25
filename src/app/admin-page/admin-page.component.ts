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
	PagesCount: number;
	selectedPage: number = 0;
	changedPass: boolean = false;
	reports: Array<any>;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
	  this.httpService.get('/users/auth').subscribe(
      data => {
        this.user = data;
      });
	  this.httpService.getAll('/reports?field=status.asc&page=', this.selectedPage).subscribe(
	  data => {
        this.PagesCount = data.totalPages;
        this.selectedPage = data.number;
        this.reports = data.content;
      });
  }
  
  accept(id: string):void {
	  this.httpService.put('/reports/' + id + '/status?status=true', null).subscribe(
	  data => {},
	  error => {
		  if (error.status === 200) {
			  this.ngOnInit();
		  }
	  });
  }
  
  ban(id: string, userId: string):void {
	  this.httpService.put('/users/' + userId + '/ban', null).subscribe(
	  data => {},
	  error => {
		  if (error.status === 200) {
			  console.log('успешно забанен');
			  this.accept(id);
		  }
	  });
  }
  
  getPass(): string {
    return localStorage.getItem('password');
  }
  
  navigate(id: string): void {
    if (Number(id) > -1) {
      localStorage.setItem('orgId', id);
      this.router.navigateByUrl('/organization');
    } 
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
    this.selectedPage = index - 1;
    this.ngOnInit();
  }

  changePage(page: number, key: string) {
    if (this.selectedPage === 0 && page === -1) {
      return;
    } else {
      this.selectedPage += page;
    }
    this.ngOnInit();
  }

}
