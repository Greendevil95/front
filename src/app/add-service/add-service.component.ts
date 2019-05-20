import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  private error = false;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
  }

  create(name1, price1, description1): void {
    this.error = false;
    this.httpService.post('/services', {
      name: name1,
      price: price1,
      description: description1,
      organization: {
        id: localStorage.getItem('orgId')
      }
    }).subscribe(data => {},
      error => {
        if (error.status === 200) {
          console.log(error);
          this.router.navigateByUrl('/organization');
        } else {
          this.error = true;
        }
      });
  }

}
