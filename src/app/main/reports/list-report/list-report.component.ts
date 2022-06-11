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

  allData: any[] = [];
  allReportsTable: Report[] = [];
  allApprovedReportsTable: Report[] = [];
  allRejectedReportsTable: Report[] = [];
  allPendingReportsTable: Report[] = [];

  authenticatedUser: User;
  searchTetx: any = "";

  constructor(private router: Router, private dataService: DataService,
    private fb: FormBuilder, private message: NzMessageService) { }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'))

    this.getReports();
  }

  getReports() {
    this.dataService.listReport()
      .subscribe((res: any) => {
        // console.log("List Report: ", res.data);
        this.allData = res.data;
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

  onAddNewReport(): void {
    this.router.navigateByUrl('/app/create-report');
  }

  onBulkAction(status: any, id: any): void {
    const params = {
      reportId: id,
      status: status === "approve" ? true : false
    }
    this.dataService.reportAction(params)
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.message.info(res.message);
          this.getReports();
        } else if (res.status === "error") {
          this.message.error(res.message);
        }
      })
  }


  onSearch(searchTxt: any) {
    const targetValue: any[] = [];
    this.allData.forEach((value: any) => {
      let keys = Object.keys(value.user);
      for (let i = 0; i < keys.length; i++) {
        if (value.user[keys[i]] && value.user[keys[i]].toString().toLocaleLowerCase().includes(searchTxt)) {
          targetValue.push(value);
          break;
        }
      }
    });

    this.allReportsTable = targetValue.map((item: any) => Report.fromMap(item));

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
    // console.log("Event: ", event);
  }
}
