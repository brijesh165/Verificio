import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/models/User';
import { DataService } from 'src/app/services/data.service';
import { ApproveRejectChangeModalComponent } from 'src/app/main/staff/approve-reject-change-modal/approve-reject-change-modal.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  userInitials: any = "";
  authenticatedUser: User;
  isSubscribed: any = false;

  isCollapsed = true;
  notificationList: any[] = [];
  constructor(private router: Router, private dataService: DataService, private modalService: NzModalService) { }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'));

    const companyInfo = JSON.parse(localStorage.getItem("company") || '{}');

    this.dataService.getCompanyById(companyInfo._id)
      .subscribe((res: any) => {
        localStorage.setItem('company', JSON.stringify(res.data));

        if (res.data.subscriptionExpiryGrace) {
          this.isSubscribed = moment().isBefore(res.data.subscriptionExpiryGrace);
        } else {
          this.isSubscribed = false;
        }
      })

    this.userInitials = this.authenticatedUser.firstName.charAt(0).toUpperCase() + "" + this.authenticatedUser.lastName.charAt(0).toUpperCase();
    this.getNotificationList();

    if (window.innerWidth < 550) {
      this.isCollapsed = true;
    }

  }

  getNotificationList(): void {
    this.dataService.getNotificationList().subscribe((data: any) => {
      this.notificationList = data.data;
    })
  }

  onNotificationClick() {
    this.router.navigate(["app/notifications"])
  }

  handleNotificationClick(data: any) {
    if (data.actionType == "employeeProfileChanged") {
      const drawerRef = this.modalService.create<ApproveRejectChangeModalComponent>({
        nzTitle: 'User Profile Review',
        nzContent: ApproveRejectChangeModalComponent,
        nzWidth: 700,
        nzFooter: null,
        nzComponentParams: {
          userId: data.params.userId
        }
      });
    } else if (data.actionType == 'employeeReported') {
      this.router.navigate(["app/reports"])
    }
  }

  onlogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');

    this.router.navigateByUrl('/auth');
  }

}
