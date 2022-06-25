import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Users } from 'src/app/models/admin/Users';
import { AdminService } from 'src/app/services/admin.service';
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
  isEdit: any = false;
  editId: any = "";

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

  constructor(private fb: FormBuilder, private adminService: AdminService, private modalService: NzModalService) { }

  ngOnInit(): void {

    this.newUserForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      designation: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
      permission: [this.permissions, [Validators.required]],
    });

    this.getAllUsers();
  }

  getAllUsers() {
    this.adminService.getAllUsers()
      .subscribe((res: any) => {
        this.tableData = res.data.map((item: any) => Users.fromMap(item));
        this.allAdminUsersTable = res.data.filter(function (item: any) {
          return item.role == 'admin'
        }).map((item: any) => Users.fromMap(item));
        this.allSuperAdminUsersTable = res.data.filter(function (item: any) {
          return item.role == 'super-admin'
        }).map((item: any) => Users.fromMap(item));
      })
  }

  onCreateNew() {
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  onAddNewUser() {
    const permissions = this.newUserForm.value.role === "super-admin" ? [] : this.newUserForm.value.permission.filter((item: any) => item.checked).map((item: any) => item.value);

    const params = {
      firstName: this.newUserForm.value.firstName,
      lastName: this.newUserForm.value.lastName,
      designation: this.newUserForm.value.designation,
      email: this.newUserForm.value.email,
      role: this.newUserForm.value.role,
      permissions: permissions,
    }

    if (this.isEdit) {
      this.adminService.updateUser({
        id: this.editId,
        params: params
      })
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.modalService.create<ModelsComponent>({
              nzTitle: '',
              nzContent: ModelsComponent,
              nzWidth: 444,
              nzFooter: null,
              nzComponentParams: {
                modelType: "success",
                modelTitle: res.message,
                modelSubTitle: ""
              }
            });

            this.isModalVisible = false;
            this.getAllUsers();
          }
        })
    } else {
      this.adminService.createUser(params)
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.modalService.create<ModelsComponent>({
              nzTitle: '',
              nzContent: ModelsComponent,
              nzWidth: 444,
              nzFooter: null,
              nzComponentParams: {
                modelType: "success",
                modelTitle: "User account has been created",
                modelSubTitle: "A mail has been sent to the user email address"
              }
            });

            this.isModalVisible = false;
            this.getAllUsers();
          }
        })
    }
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
    if (status === "edit") {
      this.isEdit = true;
      this.editId = id;
      let employee = this.tableData.filter((item: any) => item._id === id);

      const permission = this.permissions.map((item: any) => {
        return {
          label: item.label, value: item.value, checked: employee[0].permissions.includes(item.value)
        }
      });

      this.isModalVisible = true;
      this.newUserForm.patchValue({
        firstName: employee[0].firstName,
        lastName: employee[0].lastName,
        designation: employee[0].designation,
        email: employee[0].email,
        role: employee[0].role,
        permission: permission
      })
    } else if (status === "active") {
      this.adminService.deleteUser({
        id: id,
        params: {
          archived: false
        }
      })
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.modalService.create<ModelsComponent>({
              nzTitle: '',
              nzContent: ModelsComponent,
              nzWidth: 444,
              nzFooter: null,
              nzComponentParams: {
                modelType: "success",
                modelTitle: "User account has been activated successfully.",
                modelSubTitle: ""
              }
            });
          }

          this.getAllUsers();
        })
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
          this.adminService.deleteUser({
            id: id,
            params: {
              archived: true
            }
          })
            .subscribe((res: any) => {
              if (res.status === "success") {
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

              this.getAllUsers();
            })
        }
      })
    }
  }
}
