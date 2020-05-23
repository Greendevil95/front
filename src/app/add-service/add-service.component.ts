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
  category: Array<any>;
  name: any;
  categories: any;
  time: any;
  price: any;
  description: any;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.httpService.get('/other/category').subscribe(
      data => {
        this.category = data;
      }
    );
  }

  create(name, price1, description1, category1, time1): void {
    this.error = false;
    this.httpService.post('/services', {
      name: name,
      price: price1,
      time: time1,
      category: category1,
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
