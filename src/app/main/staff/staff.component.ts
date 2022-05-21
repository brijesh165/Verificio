import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

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
  successModal = false;
  deactivateModal = false;
  deactivateSuccessModal = false;
  setOfCheckedId = new Set<number>();

  newEmployeeForm: any = FormGroup;
  bulkActionForm: any = FormGroup;
  changeRoleForm: any = FormGroup;

  constructor(private dataService: DataService, private fb: FormBuilder) { }

  ngOnInit(): void {
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
      permission: [[
        { label: 'Add User', value: 'add_user' },
        { label: 'Delete User', value: 'delete_user' },
        { label: 'Deactivate User', value: 'deactivate_user' },
        { label: 'Pay Subscription', value: 'pay_subscription' },
        { label: 'Approve Report', value: 'approve_report' },
        { label: 'Create Report', value: 'create_report' },
        { label: 'Reject Report', value: 'reject_report' },
        { label: 'Create Survey', value: 'create_survey' },
        { label: 'View All Report', value: 'view_all_report' },
        { label: 'Rate Company', value: 'rate_company' },
      ], [Validators.required]]
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

  onAddNewUser() {
    const params = {
      firstName: this.newEmployeeForm.value.firstName,
      lastName: this.newEmployeeForm.value.lastName,
      designation: this.newEmployeeForm.value.designation,
      email: this.newEmployeeForm.value.email,
      role: this.newEmployeeForm.value.role,
      permissions: this.newEmployeeForm.value.role === "admin" ? this.newEmployeeForm.value.permission.filter((item: any) => item.checked).map((item: any) => item.value).toString() : ""
    }
    console.log("Params: ", params);

    this.dataService.createEmployee(params)
      .subscribe((res: any) => {
        console.log("Response: ", res);
        if (res.status === "success") {
          this.successModal = true;
        }
      })
  }

  onBulkAction() {
    console.log("Bulk Action: ", this.bulkActionForm.value.action);
    console.log("Set: ", this.setOfCheckedId.size);
    if (this.bulkActionForm.value.action === "delete" && this.setOfCheckedId.size > 0) {
      this.deactivateModal = true;
    }
  }

  handleCancel() {
    this.isVisible = false;
  }

  onSuccessOk(type: string) {
    if (type === "success") {
      this.successModal = false;
    } else if (type === "deactivate") {
      this.deactivateModal = false;
      this.deactivateSuccessModal = false;
    }
    this.ngOnInit();
  }

  onDeactivateCancel() {
    this.deactivateModal = false;
  }

  onDeactivateYes() {
    const params: any = [];
    this.setOfCheckedId.forEach((item) => {
      params.push(item);
    })

    this.dataService.deleteEmployee({ "userIds": params })
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.deactivateSuccessModal = true;
        }
      })
  }
}
