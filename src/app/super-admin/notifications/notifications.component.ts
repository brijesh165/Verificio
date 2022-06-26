import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApproveRejectChangeModalComponent } from 'src/app/main/staff/approve-reject-change-modal/approve-reject-change-modal.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notificationsList: any = [];

  constructor(private dataSerice: DataService, private modalService: NzModalService) { }

  ngOnInit(): void {
    this.getAllNotifications();
  }

  getAllNotifications() {
    this.dataSerice.getNotificationList()
      .subscribe((res: any) => {
        this.notificationsList = res.data;
      })
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
    }
  }
}
