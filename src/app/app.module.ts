import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {MatDialogModule, MatFormFieldModule, MatNativeDateModule} from '@angular/material';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';


import {AppRoutingModule, routes} from './app.routing';
import {ComponentsModule} from './components/components.module';

import {AppComponent} from './app.component';

import {UserProfileComponent} from './user-profile/user-profile.component';
import {CommonModule, registerLocaleData} from '@angular/common';
import {ChartsModule} from 'ng2-charts';
import {AddOrganizationComponent} from './add-organization/add-organization.component';
import {AddServiceComponent} from './add-service/add-service.component';
import {LoginComponent} from './login/login.component';
import {OrganizationListComponent} from './organization-list/organization-list.component';
import {OrganizationComponent} from './organization/organization.component';
import {RegistrationComponent} from './registration/registration.component';
import {ReservationListComponent} from './reservation-list/reservation-list.component';
import {ServiceListComponent} from './service-list/service-list.component';
import {ServiceComponent} from './service/service.component';
import {UserComponent} from './user/user.component';
import {HttpService} from './http/http.service';
import {MyInterceptor} from './http/http.interceptor';
import {OrgListComponent} from './org-list/org-list.component';
import localeRu from '@angular/common/locales/ru';
import {CalendarComponent, DeleteReservation} from './calendar/calendar.component';
/*import { MyClientsComponent } from './my-clients/my-clients.component';*/
import {RatingComponent} from './rating/rating.component';
import {BrowserModule} from '@angular/platform-browser';
import {UserCalendarComponent} from './user-calendar/user-calendar.component';
import {AcceptStatusComponent} from './accept-status/accept-status.component';
import {SearchResultComponent} from './search-result/search-result.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {OrgCalendarComponent} from './org-calendar/org-calendar.component';
import {AdminPageComponent} from './admin-page/admin-page.component';


registerLocaleData(localeRu);

@NgModule({
  imports: [
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR}),
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    NgbModule,
    ToastrModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule

  ],
  declarations: [
    AppComponent,
    UserProfileComponent,
    AddOrganizationComponent,
    AddServiceComponent,
    LoginComponent,
    OrganizationListComponent,
    OrganizationComponent,
    RegistrationComponent,
    ReservationListComponent,
    ServiceListComponent,
    ServiceComponent,
    UserComponent,
    OrgListComponent,
    /*MyClientsComponent*/
    CalendarComponent,
    SearchResultComponent,
    AboutUsComponent,
    DeleteReservation,
    RatingComponent,
    DeleteReservation,
    UserCalendarComponent,
    AcceptStatusComponent,
    OrgCalendarComponent,
    AdminPageComponent
  ],
  providers: [
    HttpService, {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent],

})
export class AppModule { }

export class DemoMaterialModule {}





