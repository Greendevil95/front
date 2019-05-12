import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ((req.url === '/users' && req.method === 'POST') || localStorage.getItem('email') === 'Войти') {
      return next.handle(req);
    } else {
      console.log(localStorage.getItem('email') + ' ' + localStorage.getItem('password'));
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      const authReq = req.clone({
        headers: req.headers.append('Authorization', 'Basic ' + btoa(email.toString() + ':' + password.toString()))
      });
      return next.handle(authReq);
    }
  }
}
