import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { CreateReportComponent } from './reports/create-report/create-report.component';
import { SettingsComponent } from './settings/settings.component';
import { StaffComponent } from './staff/staff.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
      { path: 'create-report', component: CreateReportComponent, canActivate: [AuthGuard] },
      { path: 'staff', component: StaffComponent, canActivate: [AuthGuard] },
      { path: 'setting', component: SettingsComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
