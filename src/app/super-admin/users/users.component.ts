import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Users } from 'src/app/models/admin/Users';
import { ModelsComponent } from '../models/models.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  tableData: any = [];
  allAdminUsersTable: any = [];
  allSuperAdminUsersTable: any = [];

  newUserForm: any = FormGroup;

  isModalVisible: any = false;
  searchText: any = "";

  permissions: any = [
    { label: 'Manage User', value: 'manage_user' },
    { label: 'Add User', value: 'create_user' },
    { label: 'Edit User', value: 'edit_user' },
    { label: 'Delete User', value: 'delete_user' },
    { label: 'Activate User', value: 'activate_user' },
    { label: 'Approve User Update', value: 'approve_user_update' },
    { label: 'Search', value: 'search' },
    { label: 'Manage Report', value: 'manage_report' },
    { label: 'Create Report', value: 'create_report' },
    { label: 'Approve Report', value: 'approve_report' },
    { label: 'Delete Report', value: 'delete_report' },
    { label: 'Reject Report', value: 'reject_report' },
    { label: 'Manage Subscription', value: 'manage_subcription' },
  ];

  constructor(private fb: FormBuilder, private modalService: NzModalService) { }

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
      permission: [this.permissions, [Validators.required]],
    });
  }

  onCreateNew() {
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  onAddNewUser() {
    console.log("Add New User");
  }

  onSearch(searchTxt: any): void {
    const targetValue: any[] = [];
    this.tableData.forEach((value: any) => {
      let keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(searchTxt)) {
          targetValue.push(value);
          break;
        }
      }
    });

    this.allAdminUsersTable = targetValue.filter(function (item: any) {
      return item
    }).map((item: any) => Users.fromMap(item));
    this.allSuperAdminUsersTable = targetValue.filter(function (item: any) {
      return item
    }).map((item: any) => Users.fromMap(item));
  }

  onBulkAction(status: any, id: any) {
    console.log("Status: ", status);

    if (status === "view") {
      console.log("Status: ", status);
    } else if (status === "edit") {
      console.log("Status: ", status);
    } else if (status === "deactivate") {
      const drawerRef = this.modalService.create<ModelsComponent>({
        nzTitle: '',
        nzContent: ModelsComponent,
        nzWidth: 444,
        nzFooter: null,
        nzComponentParams: {
          modelType: "deactivate",
          modelTitle: "Are you sure you want to deactivate users?",
          modelSubTitle: "You are about to take a serious action. Be careful before you deactivate all selected users."
        }
      });

      drawerRef.afterClose.subscribe((data: any) => {
        if (data === true) {
          this.modalService.create<ModelsComponent>({
            nzTitle: '',
            nzContent: ModelsComponent,
            nzWidth: 444,
            nzFooter: null,
            nzComponentParams: {
              modelType: "success",
              modelTitle: "User account has been deactivated successfully.",
              modelSubTitle: ""
            }
          });
        }
      })
    }
  }
}
