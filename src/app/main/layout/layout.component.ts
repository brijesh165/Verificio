import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/models/User';
import { DataService } from 'src/app/services/data.service';
import { ApproveRejectChangeModalComponent } from '../staff/approve-reject-change-modal/approve-reject-change-modal.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  userInitials: any = "";
  authenticatedUser: User;
  isCollapsed = false;
  notificationList:any[] = [];
  constructor(private router: Router, private dataService: DataService, private modalService:NzModalService) { }


  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'));
    this.userInitials = this.authenticatedUser.firstName.charAt(0).toUpperCase() + "" + this.authenticatedUser.lastName.charAt(0).toUpperCase();
    console.log("Initial: ", this.userInitials)
    this.getNotificationList();
  }

  getNotificationList():void{
    this.dataService.getNotificationList().subscribe((data:any)=>{
      this.notificationList = data.data;
    })
  }


  handleNotificationClick(data:any){
    if(data.actionType=="employeeProfileChanged"){
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

  onlogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigateByUrl('/auth');
  }
}
