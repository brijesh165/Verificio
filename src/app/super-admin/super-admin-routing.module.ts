import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { CompanyEmailComponent } from './company/company-email/company-email.component';
import { CompanyProfileComponent } from './company/company-profile/company-profile.component';
import { CompanyComponent } from './company/company.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { AddSubscriptionComponent } from './subscription/add-subscription/add-subscription.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'companies', component: CompanyComponent, canActivate: [AuthGuard] },
      { path: 'companies/view', component: CompanyProfileComponent, canActivate: [AuthGuard] },
      { path: 'companies/sendEmail', component: CompanyEmailComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
      { path: 'subscriptions', component: SubscriptionComponent, canActivate: [AuthGuard] },
      { path: 'subscriptions/add', component: AddSubscriptionComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
