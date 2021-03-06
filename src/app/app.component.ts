import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    localStorage.setItem('orgPage', '0');
    localStorage.setItem('resPage', '0');
    localStorage.setItem('servPage', '0');
    localStorage.setItem('category', '0');
	localStorage.setItem('service', '');
    localStorage.setItem('params', '');
	localStorage.setItem('admin', 'false');
    if (localStorage.getItem('email') === null) {
      localStorage.setItem('email', 'Войти');
    }
	if (localStorage.getItem('id') === null) {
		localStorage.setItem('id', '0');
	}
  }
}
