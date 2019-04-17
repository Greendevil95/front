import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import {AppRoutingModule, routes} from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import {DashboardComponent} from './dashboard/dashboard.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {IconsComponent} from './icons/icons.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';
import { AddOrganizationComponent } from './add-organization/add-organization.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { LoginComponent } from './login/login.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationComponent } from './organization/organization.component';
import { RegistrationComponent } from './registration/registration.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceComponent } from './service/service.component';
import { UserComponent } from './user/user.component';
import {HttpService} from './http/http.service';
import {MyInterceptor} from './http/http.interceptor';
import { OrgListComponent } from './org-list/org-list.component';

@NgModule({
  imports: [
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
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
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

  ],
  providers: [
    HttpService, {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
