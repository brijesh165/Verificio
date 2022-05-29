import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notificationsList: any = [];

  constructor(private dataSerice: DataService) { }

  ngOnInit(): void {
    this.getAllNotifications();
  }

  getAllNotifications() {
    this.dataSerice.getNotificationList()
      .subscribe((res: any) => {
        console.log("Notifications Response: ", res);

        this.notificationsList = res.data;
      })
  }
}
