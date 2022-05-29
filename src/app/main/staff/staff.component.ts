import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { DataService } from 'src/app/services/data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModelsComponent } from '../models/models.component';
import { ImportCsvComponent } from './import-csv/import-csv.component';


@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  tableData: any = [];

  allEmployeeData: any = [];
  allAdminData: any = [];
  allArchiveData: any = [];

  isVisible = false;

  isEdit: any = false;
  editId: any = "";
  searchTetx: any = "";

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
    { label: 'Manage Report', value: 'manage_report' },
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

    this.listEmployee();
  }

  listEmployee() {
    this.dataService.listEmployee()
      .subscribe((res: any) => {
        this.tableData = res.data.map((item: any) => User.fromMap(item));
        this.allAdminData = res.data.filter(function (item: any) {
          return item.role == 'company-owner' && item.archived == false
        }).map((item: any) => User.fromMap(item));
        this.allEmployeeData = res.data.filter(function (item: any) {
          return item.role == 'company-employee' && item.archived == false
        }).map((item: any) => User.fromMap(item));
        this.allArchiveData = res.data.filter(function (item: any) {
          return item.archived == true;
        }).map((item: any) => User.fromMap(item));
      })
  }

  onCurrentPageDataChange(event: any) {
    console.log("Event: ", event);
  }

  onAddNew() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  onAddNewUser() {
    const permissions = this.newEmployeeForm.value.role === "admin" ? [] : this.newEmployeeForm.value.permission.filter((item: any) => item.checked).map((item: any) => item.value);
    console.log("Permissions: ", permissions)
    const params = {
      firstName: this.newEmployeeForm.value.firstName,
      lastName: this.newEmployeeForm.value.lastName,
      designation: this.newEmployeeForm.value.designation,
      email: this.newEmployeeForm.value.email,
      role: this.newEmployeeForm.value.role,
      permissions: permissions
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
              nzFooter: null,
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
              nzFooter: null,
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
          } else {
            this.message.error(res.message);
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

    this.allAdminData = targetValue.filter(function (item: any) {
      return item.role == 'company-owner' && item.archived == false
    }).map((item: any) => User.fromMap(item));
    this.allEmployeeData = targetValue.filter(function (item: any) {
      return item.role == 'company-employee' && item.archived == false
    }).map((item: any) => User.fromMap(item));
    this.allArchiveData = targetValue.filter(function (item: any) {
      return item.archived == true;
    }).map((item: any) => User.fromMap(item));
  }

  changeAction(value: any, id: any): void {
    if (value === "edit") {
      this.onEdit(id);
    } else if (value === "delete") {
      this.onDelete(id);
    }
  }

  openImportCSVModal() : void{
    
    const drawerRef = this.modalService.create<ImportCsvComponent>({
      nzTitle: 'Import From CSV',
      nzContent: ImportCsvComponent,
      nzWidth: 444,
      nzFooter: null,
      nzComponentParams: {
      
      }
    });

    drawerRef.afterClose.subscribe((data: any) => {
      this.listEmployee();
    });
    
  }

  onEdit(id: any): void {
    this.isEdit = true;
    this.editId = id;
    let employee = this.tableData.filter((item: any) => item._id === id);

    const permission = this.permissions.map((item: any) => {
      return {
        label: item.label, value: item.value, checked: employee[0].permissions.includes(item.value)
      }
    });

    this.isVisible = true;
    this.newEmployeeForm.patchValue({
      firstName: employee[0].firstName,
      lastName: employee[0].lastName,
      designation: employee[0].designation,
      email: employee[0].email,
      role: employee[0].role,
      permission: permission
    })
  }

  onDelete(id: any): void {
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

        this.dataService.deleteEmployee({ "userIds": [id] })
          .subscribe((res: any) => {
            if (res.status === "success") {
              this.bulkActionForm.patchValue({
                action: null
              })

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

              this.listEmployee()

            } else if (res.status === "error") {
              this.message.create('error', res.message);
            }
          })
      }
    })
  }
}
