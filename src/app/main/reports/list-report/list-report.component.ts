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

  allReportsTable: Report[] = [];
  allApprovedReportsTable: Report[] = [];
  allRejectedReportsTable: Report[] = [];
  allPendingReportsTable: Report[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  authenticatedUser: User;
  searchTetx: any = "";

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
        this.allReportsTable = res.data.map((item: any) => Report.fromMap(item));

        this.allApprovedReportsTable = res.data.filter(function (item: any) {
          return (item.isApproved === true)
        }).map((item: any) => Report.fromMap(item));

        this.allRejectedReportsTable = res.data.filter(function (item: any) {
          return (item.approvedBy !== null && item.isApproved == false)
        }).map((item: any) => Report.fromMap(item));

        this.allPendingReportsTable = res.data.filter(function (item: any) {
          return item.approvedBy == null
        }).map((item: any) => Report.fromMap(item));
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

  onSearch(searchTxt: any) {
    const targetValue: any[] = [];
    this.allReportsTable.forEach((value: any) => {
      let keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(searchTxt)) {
          targetValue.push(value);
          break;
        }
      }
    });

    this.allApprovedReportsTable = targetValue.filter(function (item: any) {
      return (item.approvedBy == null && item.isApproved === true)
    }).map((item: any) => Report.fromMap(item));

    this.allRejectedReportsTable = targetValue.filter(function (item: any) {
      return (item.approvedBy !== null && item.isApproved == false)
    }).map((item: any) => Report.fromMap(item));

    this.allPendingReportsTable = targetValue.filter(function (item: any) {
      return item.approvedBy == null
    }).map((item: any) => Report.fromMap(item));
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
    this.checked = this.allReportsTable.every((item: any) => this.setOfCheckedId.has(item._id));
    this.indeterminate = this.allReportsTable.some((item: any) => this.setOfCheckedId.has(item._id)) && !this.checked;
  }

  onAllChecked(value: boolean): void {
    this.allReportsTable.forEach((item: any) => this.updateCheckedSet(item._id, value));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
}
