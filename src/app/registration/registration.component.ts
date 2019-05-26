import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  email: any;
  name: any;
  phone: any;
  password: any;
  repeatPassword: any;


  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {

  }


  registration(email1, password1, name1, phone1): void {
    this.httpService.post('/users', {
      email: email1,
      password: password1,
      name: name1,
      phone: phone1
    }).subscribe(data => { },
      error => {
        if (error.status === 200) {
          this.router.navigateByUrl('/log');
        }
      }
    );
  }

}
