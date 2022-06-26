import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Company } from 'src/app/models/admin/Company';
import { AdminService } from 'src/app/services/admin.service';
import { ModelsComponent } from '../models/models.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  allActiveCompaniesTable: any = [];
  totalActiveCompanies: any;
  allSuspendedCompaniesTable: any = [];
  totalSuspendedCompanies: any;
  isActiveLoading: any = false;

  suspenstionForm: any = FormGroup;

  isVisible: any = false;
  suspendId: any = "";

  constructor(
    private adminService: AdminService, private fb: FormBuilder,
    private modalService: NzModalService, private router: Router
  ) { }

  ngOnInit(): void {

    this.suspenstionForm = this.fb.group({
      reasons: [{ value: null, disabled: false }, [Validators.required]],
      liftSuspension: [{ value: null, disabled: false }, [Validators.required]]
    })

    this.getActiveCompanies(1, 10);
    this.getSuspendedCompanies(1, 10);
  }

  getActiveCompanies(page: any, pageSize: any) {
    this.isActiveLoading = true;
    const params = {
      page: page,
      pageSize: pageSize,
      archived: false
    }
    this.adminService.getCompanyList(params)
      .subscribe((res: any) => {
        this.totalActiveCompanies = res.data.totalItems;
        this.allActiveCompaniesTable = res.data.companyList.map((item: any) => Company.fromMap(item));
        this.isActiveLoading = false;
      })
  }

  getSuspendedCompanies(page: any, pageSize: any) {
    const params = {
      page: page,
      pageSize: pageSize,
      archived: true
    }
    this.adminService.getCompanyList(params)
      .subscribe((res: any) => {
        this.allSuspendedCompaniesTable = res.data.companyList.map((item: any) => Company.fromMap(item));
      })
  }

  onPageIndexChange(event: any) {
    this.getActiveCompanies(event, 10);
  }

  pageSizeChanged(event: any) {
    this.getActiveCompanies(1, event);
  }

  onPageIndexChangeForSuper(event: any) {
    this.getSuspendedCompanies(event, 10);
  }

  pageSizeChangedForSuper(event: any) {
    this.getSuspendedCompanies(1, event);
  }

  onBulkAction(status: any, id: any): void {
    if (status === "view") {
      this.router.navigate(["admin/companies/view"],
        { state: { id: id } }
      )
    } else if (status === "sendMail") {
      this.router.navigate(["admin/companies/sendEmail"],
        { state: { id: id } }
      )
    } else if (status === "suspend") {
      this.suspendId = id;
      this.isVisible = true;
    } else if (status === "unsuspend") {

      this.adminService.unSuspendCompany({ companyId: id })
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.suspendId = "";
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
          }

          this.getActiveCompanies(1, 10);
          this.getSuspendedCompanies(1, 10);
        });
    }
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleSuspend() {
    const params = {
      "companyId": this.suspendId,
      "reason": this.suspenstionForm.value.reasons,
      "nextSteps": this.suspenstionForm.value.liftSuspension
    };

    this.adminService.suspendCompany(params)
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.suspendId = "";
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
        }

        this.getActiveCompanies(1, 10);
        this.getSuspendedCompanies(1, 10);
      })
  }
}
