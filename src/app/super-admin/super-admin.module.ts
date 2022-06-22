import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';


import { NgApexchartsModule } from 'ng-apexcharts';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NgOtpInputModule } from 'ng-otp-input';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyComponent } from './company/company.component';
import { CompanyProfileComponent } from './company/company-profile/company-profile.component';
import { ModelsComponent } from './models/models.component';
import { CompanyEmailComponent } from './company/company-email/company-email.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AddSubscriptionComponent } from './subscription/add-subscription/add-subscription.component';
import { ReportsComponent } from './reports/reports.component';


@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    CompanyComponent,
    CompanyProfileComponent,
    ModelsComponent,
    CompanyEmailComponent,
    SubscriptionComponent,
    AddSubscriptionComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    NgApexchartsModule,
    NzTypographyModule,
    NzEmptyModule,
    NgOtpInputModule,
    NzPopoverModule,
    NzAlertModule,
    NzLayoutModule,
    NzIconModule,
    NzCardModule,
    NzGridModule,
    NzBreadCrumbModule,
    NzTabsModule,
    NzListModule,
    NzSwitchModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzDropDownModule,
    NzTableModule,
    NzModalModule,
    NzSelectModule,
    NzCheckboxModule,
    NzUploadModule,
    NzAvatarModule,
    NzDatePickerModule,
    NzMessageModule,
    NzResultModule,
    NzDescriptionsModule,
    NzNotificationModule,
  ]
})
export class SuperAdminModule { }
