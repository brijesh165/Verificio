import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { DataService } from 'src/app/services/data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Report } from 'src/app/models/Report';

@Component({
  selector: 'app-list-report',
  templateUrl: './list-report.component.html',
  styleUrls: ['./list-report.component.scss']
})
export class ListReportComponent implements OnInit {

  reportsTable: Report[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  authenticatedUser: User;

  bulkActionForm: any = FormGroup;

  constructor(private router: Router, private dataService: DataService,
    private fb: FormBuilder, private message: NzMessageService) { }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'))

    this.bulkActionForm = this.fb.group({
      action: [null, [Validators.required]]
    });

    this.getReports();
  }

  getReports() {
    this.dataService.listReport()
      .subscribe((res: any) => {
        this.reportsTable = res.data.map((item: any) => Report.fromMap(item));
      })
  }

  onAddNew(): void {
    this.router.navigateByUrl('/app/report');
  }

  onBulkAction(): void {
    const selectedReport: any = [];
    this.setOfCheckedId.forEach((item) => {
      selectedReport.push(item);
    })

    if (this.bulkActionForm.value.action === null) {
      this.message.create('error', 'Please select an action.');
      return;
    }

    if (selectedReport.length > 0 && this.bulkActionForm.value.action !== null) {
      const params = {
        reportId: selectedReport,
        status: this.bulkActionForm.value.action === "approve" ? true : false
      }
      this.dataService.reportAction(params)
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.message.info(`Report status changed to ${this.bulkActionForm.value.action}`);
            this.bulkActionForm.patchValue({
              action: null
            })
            this.setOfCheckedId.clear();
            this.refreshCheckedStatus();
            this.getReports();
          }
        })
    } else {
      this.message.create('error', 'Please select report.');
    }
  }

  onCurrentPageDataChange(event: any) {
    console.log("Event: ", event);
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.reportsTable.every((item: any) => this.setOfCheckedId.has(item._id));
    this.indeterminate = this.reportsTable.some((item: any) => this.setOfCheckedId.has(item._id)) && !this.checked;
  }

  onAllChecked(value: boolean): void {
    this.reportsTable.forEach((item: any) => this.updateCheckedSet(item._id, value));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
}
