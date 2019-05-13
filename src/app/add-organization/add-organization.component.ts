import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';
import {Time} from "@angular/common";

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.scss']
})
export class AddOrganizationComponent implements OnInit {
  private error = false;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
  }

  create(name1, address1, phone1, description1,startTime1?,finishTime1?): void {
    this.error = false;
    this.httpService.post('/organizations', {
      name: name1,
      address: address1,
      phoneNumber: phone1,
      description: description1,
      startTime: startTime1,
      finishTime: finishTime1
    }).subscribe(data => {},
      error => {
        if (error.status === 200) {
          console.log(error);
          this.router.navigateByUrl('/user');
        } else {
          this.error = true;
        }
      });
  }

}
