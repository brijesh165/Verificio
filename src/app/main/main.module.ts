import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';

import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { StaffComponent } from './staff/staff.component';
import { ListReportComponent } from './reports/list-report/list-report.component';
import { CreateReportComponent } from './reports/create-report/create-report.component';
import { ModelsComponent } from './models/models.component';
import { ImportCsvComponent } from './staff/import-csv/import-csv.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FilterDatePipe } from './pipes/filter-date.pipe';
import { ApproveRejectChangeModalComponent } from './staff/approve-reject-change-modal/approve-reject-change-modal.component';
import { SearchComponent } from './search/search.component';
import { UserProfileComponent } from './search/user-profile/user-profile.component';
import { SubscriptionComponent } from './subscription/subscription.component';

import { NgApexchartsModule } from 'ng-apexcharts';
import { Angular4PaystackModule } from 'angular4-paystack';
import { environment } from 'src/environments/environment';

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


@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    SettingsComponent,
    StaffComponent,
    CreateReportComponent,
    ListReportComponent,
    ModelsComponent,
    ImportCsvComponent,
    NotificationsComponent,
    FilterDatePipe,
    ApproveRejectChangeModalComponent,
    SearchComponent,
    UserProfileComponent,
    SubscriptionComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    NgApexchartsModule,
    Angular4PaystackModule.forRoot(environment.payStack),


    NzTypographyModule,
    ReactiveFormsModule,
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
  ],
  exports: [
    FilterDatePipe,
  ]
})
export class MainModule { }
