import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { DataService } from 'src/app/services/data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModelsComponent } from '../models/models.component';


@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  tableData: any = [];
  checked = false;
  indeterminate = false;
  isVisible = false;

  isEdit: any = false;
  editId: any = "";
  setOfCheckedId = new Set<number>();

  newEmployeeForm: any = FormGroup;
  bulkActionForm: any = FormGroup;
  changeRoleForm: any = FormGroup;

  authenticatedUser: User;

  permissions: any = [
    { label: 'Manage User', value: 'manage_user' },
    { label: 'Add User', value: 'create_user' },
    { label: 'Edit User', value: 'edit_user' },
    { label: 'Delete User', value: 'delete_user' },
    { label: 'Approve User Update', value: 'approve_user_update' },
    { label: 'Search', value: 'search' },
    { label: 'Create Report', value: 'create_report' },
    { label: 'Approve Report', value: 'approve_report' },
    { label: 'Delete Report', value: 'delete_report' },
    { label: 'Reject Report', value: 'reject_report' },
    { label: 'Manage Subscription', value: 'manage_subcription' },
  ];

  constructor(private dataService: DataService, private fb: FormBuilder,
    private message: NzMessageService, private modalService: NzModalService) { }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'));
    this.bulkActionForm = this.fb.group({
      action: [null, [Validators.required]]
    });

    this.changeRoleForm = this.fb.group({
      role: [null, [Validators.required]]
    })

    this.newEmployeeForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      designation: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
      permission: [this.permissions, [Validators.required]]
    });

    this.dataService.listEmployee()
      .subscribe((res: any) => {
        console.log("Response: ", res);
        this.tableData = res.data;
      })
  }

  onCurrentPageDataChange(event: any) {
    console.log("Event: ", event);
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.tableData.every((item: any) => this.setOfCheckedId.has(item._id));
    this.indeterminate = this.tableData.some((item: any) => this.setOfCheckedId.has(item._id)) && !this.checked;
  }

  onAllChecked(value: boolean): void {
    this.tableData.forEach((item: any) => this.updateCheckedSet(item._id, value));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: number, checked: boolean) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAddNew() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  onAddNewUser() {
    const permissions = this.newEmployeeForm.value.role === "admin" ? this.newEmployeeForm.value.permission.filter((item: any) => item.value).map((item: any) => item.value).toString() : this.newEmployeeForm.value.permission.filter((item: any) => item.checked).map((item: any) => item.value).toString();
    console.log("Permissions: ", permissions)
    const params = {
      firstName: this.newEmployeeForm.value.firstName,
      lastName: this.newEmployeeForm.value.lastName,
      designation: this.newEmployeeForm.value.designation,
      email: this.newEmployeeForm.value.email,
      role: this.newEmployeeForm.value.role,
      permissions: [permissions]
    }

    if (this.isEdit) {
      this.dataService.updateEmployee({ id: this.editId, body: params })
        .subscribe((res: any) => {
          console.log("Response: ", res);
          if (res.status === "success") {
            this.isVisible = false;
            const drawerRef = this.modalService.create<ModelsComponent>({
              nzTitle: '',
              nzContent: ModelsComponent,
              nzWidth: 444,
              nzComponentParams: {
                modelType: "success",
                modelTitle: "Employee details updated successfully",
                modelSubTitle: ""
              }
            });

            drawerRef.afterClose.subscribe((data: any) => {
              if (data === true) {
                this.isEdit = false;
                this.editId = "";
                this.isVisible = false;
                this.ngOnInit();
              }
            })
          } else if (res.status === "error") {
            this.message.create('error', res.message);
          }
        })

    } else {
      this.dataService.createEmployee(params)
        .subscribe((res: any) => {
          console.log("Response: ", res);
          if (res.status === "success") {
            const drawerRef = this.modalService.create<ModelsComponent>({
              nzTitle: '',
              nzContent: ModelsComponent,
              nzWidth: 444,
              nzComponentParams: {
                modelType: "success",
                modelTitle: "User account has been created",
                modelSubTitle: "A mail has been sent to the user email address"
              }
            });

            drawerRef.afterClose.subscribe((data: any) => {
              if (data === true) {
                this.isVisible = false;
                this.ngOnInit();
              }
            })
          }
        })
    }
  }

  onEdit(id: any): void {
    console.log("Edit: ", id)
    this.isEdit = true;
    this.editId = id;
    let employee = this.tableData.filter((item: any) => item._id === id);
    console.log("Employee: ", employee);

    const permission = this.permissions.map((item: any) => {
      return {
        label: item.label, value: item.value, checked: employee[0].permissions[0].includes(item.value)
      }
    });

    this.isVisible = true;
    this.newEmployeeForm.patchValue({
      firstName: employee[0].firstName,
      lastName: employee[0].lastName,
      designation: employee[0].designation,
      email: employee[0].email,
      role: employee[0].role === "company-owner" ? "admin" : "employee",
      permission: permission
    })
  }

  onBulkAction() {
    if (this.bulkActionForm.value.action === "delete" && this.setOfCheckedId.size > 0) {
      const drawerRef = this.modalService.create<ModelsComponent>({
        nzTitle: '',
        nzContent: ModelsComponent,
        nzWidth: 444,
        nzFooter: null,
        nzComponentParams: {
          modelType: "deactivate",
          modelTitle: "Are you sure you want to deactivate ?",
          modelSubTitle: "You are about to take a serious action. Be careful before you deactivate this account"
        }
      });

      drawerRef.afterClose.subscribe((data: any) => {
        if (data === true) {
          const params: any = [];
          this.setOfCheckedId.forEach((item) => {
            params.push(item);
          })

          this.dataService.deleteEmployee({ "userIds": params })
            .subscribe((res: any) => {
              if (res.status === "success") {
                // this.message.create('success', res.message);
                this.bulkActionForm.patchValue({
                  action: null
                })
                this.setOfCheckedId.clear();
                this.refreshCheckedStatus();

                this.modalService.create<ModelsComponent>({
                  nzTitle: '',
                  nzContent: ModelsComponent,
                  nzWidth: 444,
                  nzFooter: null,
                  nzComponentParams: {
                    modelType: "success",
                    modelTitle: "User  account has been deactivated.",
                    modelSubTitle: ""
                  }
                });

              } else if (res.status === "error") {
                this.message.create('error', res.message);
              }
            })
        }
      })
    }
  }
}
