import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  data: any = {};
  myHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.myHeaders.append('Content-type', 'application/json');
  }

  get(url: string): Observable<any> {
    return this.http.get(url, {headers: this.myHeaders});
  }

  getAll(url: string, page: number): Observable<any> {
    return this.http.get(url + '?page=' + page.toString(), {headers: this.myHeaders});
  }

  post(url: string, body: any): Observable<any> {
    return this.http.post(url, body, {headers: this.myHeaders});
  }

  put(url: string, body: any): Observable<any> {
    return this.http.put(url, body, {headers: this.myHeaders});
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url, {headers: this.myHeaders});
  }
}
