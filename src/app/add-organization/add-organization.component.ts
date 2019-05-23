import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

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

  create(name1, address1, phone1, description1, startTime1, finishTime1): void {
    this.error = false;
    this.httpService.post('/organizations', {
      name: name1,
      address: address1,
      phoneNumber: phone1,
      description: description1,
      /*startTime: new Date(startTime1),
      finishTime: new Date(finishTime1)*/
    }).subscribe(data => {},
      error => {
        if (error.status === 200) {
          /*console.log(error.error.text);
          var id = error.error.text.split('id ', 2);
          console.log(id[1]);
          localStorage.setItem('orgId', '');
          this.router.navigateByUrl('add-service');*/
          this.router.navigateByUrl('user');
        } else {
          this.error = true;
        }
      });
  }

}
