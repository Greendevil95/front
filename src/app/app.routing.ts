import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

// import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {IconsComponent} from './icons/icons.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {RegistrationComponent} from './registration/registration.component';
import {LoginComponent} from './login/login.component';
import {ServiceComponent} from './service/service.component';
import {UserComponent} from './user/user.component';
import {OrganizationComponent} from './organization/organization.component';
import {AddServiceComponent} from './add-service/add-service.component';
import {AddOrganizationComponent} from './add-organization/add-organization.component';
import {OrganizationListComponent} from './organization-list/organization-list.component';
import {OrgListComponent} from './org-list/org-list.component';
import {ReservationListComponent} from './reservation-list/reservation-list.component';
import {SearchResultComponent} from './search-result/search-result.component';
import {CalendarComponent} from './calendar/calendar.component';


export const routes: Routes = [
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'user-profile',   component: UserProfileComponent },
  { path: 'table-list',     component: TableListComponent },
  { path: 'typography',     component: TypographyComponent },
  { path: 'icons',          component: IconsComponent },
  { path: 'notifications',  component: NotificationsComponent },

  // { path: '', component: OrganizationListComponent},
  { path: '', component: OrgListComponent},
  { path: 'registration', component: RegistrationComponent },
  { path: 'log', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'organization', component: OrganizationComponent },
  { path: 'add-service', component: AddServiceComponent },
  { path: 'add-organization', component: AddOrganizationComponent },
  { path: 'reservations', component: ReservationListComponent },
  { path: 'search_result', component: SearchResultComponent},
  { path: 'calendar', component: CalendarComponent}
];
/*const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }]},
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];*/

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
