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
  organizations2: Array<any>;
  organizations3: Array<any>;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.httpService.get('/users/auth').subscribe(
      data => {
        this.user = data;
      });

    this.httpService.getAll('/organizations', 0).subscribe(
      data => {
        console.log(data.content);
        this.organizations = data.content;
      });
    this.httpService.getAll('/reservations', 0).subscribe(
      data => {
        this.reservations = data.content;
      });
  }

  navigate(id: string): void {
    localStorage.setItem('page', '0');
    if (Number(id) > -1) {
      localStorage.setItem('orgId', id);
      this.router.navigateByUrl('/organization');
    } else {
      localStorage.setItem('page', '0');
      this.router.navigateByUrl('/add-organization');
    }
  }

  goToOrg(id: string): void {
    localStorage.setItem('orgId', id);
    localStorage.setItem('page', '0');
    this.router.navigateByUrl('/organization');
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
