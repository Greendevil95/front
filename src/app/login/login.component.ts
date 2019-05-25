import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';
import {NavbarComponent} from '../components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error = true;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
  }

  Enter(email1, password1): void {
    this.error = true;
    console.log(password1);
    localStorage.setItem('email', email1);
    localStorage.setItem('password', password1);
    this.httpService.get('/users/auth').subscribe(data => {
      localStorage.setItem('id', data.id);
      localStorage.setItem('username', data.email);
	  if (data.roles[0] == 'ADMIN') {
		localStorage.setItem('admin', 'true');
		this.router.navigateByUrl('admin');
	  } else {
	  this.router.navigateByUrl('');
	  }
    }, err => {
      this.error = false;
      console.log('User authentication failed!');
    });
  }

}
