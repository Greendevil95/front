import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  userId: string;
  organization: any;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    this.httpService.get('organizations/' + localStorage.getItem('orgId')).subscribe(
      data => {
        console.log(localStorage.getItem('orgId'));
        this.organization = data;
      });
  }

  addService(): void {
    this.router.navigateByUrl('/add-service');
  }

}
