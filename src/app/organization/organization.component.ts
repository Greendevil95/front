import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

interface Organization {
  id: number;
  startTime: string;
  finishTime:string;
  weekend:any;
  user:[
    {id:number}
    ]
}

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  userId: string;
  organization: any;
  org: any;
  startOfDay:number;
  endOfDay:number;
  weekends: Array<any> = [];
  week: string;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    this.httpService.get('organizations/' + localStorage.getItem('orgId')).subscribe(
      data => {
        console.log(localStorage.getItem('orgId'));
        this.organization = data;
        this.org = <Organization>data;
        this.startOfDay = parseInt(this.org.startTime.toString(),10);
        this.endOfDay = parseInt(this.org.finishTime.toString(),10);
        this.week = this.org.weekend;
        console.log(this.week);
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

  changeOrg(name1: string, address1: string, phoneNumber1: string, description1: string,startTime1?, finishTime1?, monday?,tuesday?,wednesday?,thursday?,friday?,saturday?,sunday?): void {
    //this.createMass(monday,tuesday,wednesday,thursday,friday,saturday,sunday);
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
    if (startTime1 == null){
      startTime1 = this.org.startTime
    }
    if (finishTime1 == null){
      finishTime1 = this.org.finishTime
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
      startTime: this.org.startTime,
      finishTime: this.org.finishTime,
      rating: this.organization.rating,
      weekend:this.week
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
