import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from 'src/app/services/admin.service';
import { ModelsComponent } from '../models/models.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  allActiveCompaniesTable: any = [];
  allSuspendedCompaniesTable: any = [];

  constructor(
    private adminService: AdminService,
    private modalService: NzModalService, private router: Router
  ) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies() {
    this.adminService.getCompanyList()
      .subscribe((res: any) => {
        console.log("Response: ", res.data);
      })
  }

  onBulkAction(status: any, id: any): void {
    if (status === "view") {
      this.router.navigate(["admin/companies/view",
        { state: { id: id } }
      ])
    } else if (status === "sendMail") {
      this.router.navigate(["admin/companies/sendEmail",
        { state: { id: id } }
      ])
    } else if (status === "suspend") {
      const drawerRef = this.modalService.create<ModelsComponent>({
        nzTitle: '',
        nzContent: ModelsComponent,
        nzWidth: 444,
        nzFooter: null,
        nzComponentParams: {
          modelType: "deactivate",
          modelTitle: "Are you sure you want to suspend this user?",
          modelSubTitle: "You are about to take a serious action. Be careful before you suspend this account"
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
              modelTitle: "User has been suspended. You mayb send a suspension email now",
              modelSubTitle: ""
            }
          });
        }
      })
    } else if (status === "unsuspend") {
      console.log("Unsuspend");
    }
  }
}
