import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CreateReportComponent } from './reports/create-report/create-report.component';
import { ListReportComponent } from './reports/list-report/list-report.component';
import { SearchComponent } from './search/search.component';
import { UserProfileComponent } from './search/user-profile/user-profile.component';
import { SettingsComponent } from './settings/settings.component';
import { StaffComponent } from './staff/staff.component';
import { SubscriptionComponent } from './subscription/subscription.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'create-report', component: CreateReportComponent, canActivate: [AuthGuard] },
      { path: 'staff', component: StaffComponent, canActivate: [AuthGuard] },
      { path: 'reports', component: ListReportComponent, canActivate: [AuthGuard] },
      { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
      { path: 'subscriptions', component: SubscriptionComponent, canActivate: [AuthGuard] },
      { path: 'setting', component: SettingsComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
