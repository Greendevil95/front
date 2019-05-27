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
  weekends: Array<any> = [];
  week: string = "";

  createMass(monday?,tuesday?,wednesday?,thursday?,friday?,saturday?,sunday?):void{
    if (!monday){
      //this.weekends.push(0);
      this.week = this.week + '1';
    }
    if (!tuesday){
      //this.weekends.push(1);
      this.week = this.week + '2';
    }
    if (!wednesday){
      //this.weekends.push(2);
      this.week = this.week + '3';
    }
    if (!thursday){
      //this.weekends.push(3);
      this.week = this.week + '4';
    }
    if (!friday){
      //this.weekends.push(4);
      this.week = this.week + '5';
    }
    if (!saturday){
      //this.weekends.push(5);
      this.week = this.week + '6';
    }
    if (!sunday){
      //this.weekends.push(6);
      this.week = this.week + '0';
    }
  }

  create(name1, address1, phone1, description1, startTime1, finishTime1, monday?,tuesday?,wednesday?,thursday?,friday?,saturday?,sunday?): void {
    this.createMass(monday,tuesday,wednesday,thursday,friday,saturday,sunday);
    //let hours = startTime1.getHours();
    //let minutes = startTime1.getMinutes();
    console.log(startTime1);
    this.error = false;
    this.httpService.post('/organizations', {
      name: name1,
      address: address1,
      phoneNumber: phone1,
      description: description1,
      weekend:this.week,
      startTime: startTime1,
      finishTime: finishTime1
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
