import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../http/http.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  pages: number;
  results: any;
  services: Array<any>;
  organizations: any;

  constructor(private router: Router, private httpService: HttpService) { }

  ngOnInit() {
    this.pages = 0;
    /*this.httpService.getAll('/users?email=' + localStorage.getItem('searchString'), Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        this.pages += data.totalPages;
        this.users = data.content;
      });*/

    /*this.httpService.getAll('/organizations?name=' + localStorage.getItem('searchString'), Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        console.log(data);
        this.pages += data.totalPages;
        this.organizations = data.content;
      });*/

    console.log(localStorage.getItem('searchString'));
    this.httpService.getAll('/service?search=name:' + localStorage.getItem('searchString'), Number(localStorage.getItem('resPage'))).subscribe(
      data => {
        console.log(data);
        this.pages += data.totalPages;
        this.results = data.content;
      });

    // this.results.push(this.users);
    /*this.results.push(this.organizations);
    this.results.push(this.services);*/
    console.log(this.results);
  }

}
