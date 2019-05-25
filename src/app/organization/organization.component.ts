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
        this.organization = data;
      });
  }
  
  isAdmin(): boolean {
	  if (localStorage.getItem('admin') === 'true') {
		  return true;
	  } else {
		  return false;
	  }
  }
  
  ban(id: string):void {
	  this.httpService.put('/users/' + id + '/ban', null).subscribe(
	  data => {},
	  error => {
		  if (error.status === 200) {
			  console.log('успешно забанен');
			  this.ngOnInit();
		  }
	  });
  }
  
  razban(id: string):void {
	  this.httpService.put('/users/' + id + '/active', null).subscribe(
	  data => {},
	  error => {
		  if (error.status === 200) {
			  console.log('успешно разбанен');
			  this.ngOnInit();
		  }
	  });
  }

  changeOrg(name1: string, address1: string, phoneNumber1: string, description1: string): void {
    console.log('id:' +  Number(localStorage.getItem('orgId')),
      'name:' + name1,
      'address:' + address1,
      'phoneNumber:' + phoneNumber1,
      'description:' + description1,
      'startTime:' + this.organization.startTime,
      'finishTime:' + this.organization.finishTime,
      'rating:' + this.organization.rating);
    if (name1 == null) {
      name1 = this.organization.name;
    }
    if (address1 == null) {
      address1 = this.organization.address;
    }
    if (phoneNumber1 == null) {
      phoneNumber1 = this.organization.phoneNumber;
    }
    if (description1 == null) {
      description1 = this.organization.description;
    }
    console.log('id:' +  Number(localStorage.getItem('orgId')),
      'name:' + name1,
      'address:' + address1,
      'phoneNumber:' + phoneNumber1,
      'description:' + description1,
      'startTime:' + this.organization.startTime,
      'finishTime:' + this.organization.finishTime,
      'rating:' + this.organization.rating);
    this.httpService.put('/organizations/' + localStorage.getItem('orgId'), {
      id: Number(localStorage.getItem('orgId')),
      name: name1,
      address: address1,
      phoneNumber: phoneNumber1,
      description: description1,
      startTime: this.organization.startTime,
      finishTime: this.organization.finishTime,
      rating: this.organization.rating
    }).subscribe(
      data => {
      },
      error => {
        if (error.status === 200) {
          this.ngOnInit();
        }
      });
  }

  addService(): void {
    this.router.navigateByUrl('/add-service');
  }

  routing(id: string): void {
    console.log(id);
    this.router.navigateByUrl('/user');
  }

  navigate(id: string): void {
    localStorage.setItem('orgId', id);
    localStorage.setItem('servPage', '0');
    this.router.navigateByUrl('/org-calendar');
  }

}
