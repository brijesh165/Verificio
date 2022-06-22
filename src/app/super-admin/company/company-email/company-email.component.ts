import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalTypes, NzModalService } from 'ng-zorro-antd/modal';
import { ModelsComponent } from '../../models/models.component';

@Component({
  selector: 'app-company-email',
  templateUrl: './company-email.component.html',
  styleUrls: ['./company-email.component.scss']
})
export class CompanyEmailComponent implements OnInit {

  emailForm: any = FormGroup;

  showPreview: any = false;
  previewData: any = {};
  paramsFromParent: any;

  constructor(private fb: FormBuilder, private router: Router,
    private modalService: NzModalService) {
    const routeParams: any = this.router.getCurrentNavigation();
    this.paramsFromParent = routeParams.extras.state;
  }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: [{ value: null, disabled: true }, [Validators.required]],
      reasons: [{ value: null, disabled: false }, [Validators.required]],
      liftSuspension: [{ value: null, disabled: false }, [Validators.required]]
    })

    this.getEmployeeInfo(this.paramsFromParent)
  }

  getEmployeeInfo(id: any) {
    console.log("Id for Email: ", id);
  }

  handelEmailCancel() {
    this.router.navigate(["admin/dashboard"]);
  }

  handleEmailSubmit() {
    this.previewData.email = this.emailForm.value.email;
    this.previewData.reasons = this.emailForm.value.reasons;
    this.previewData.liftSuspension = this.emailForm.value.liftSuspension;
    this.showPreview = true;
  }

  onPreviewReportBack() {
    this.showPreview = false;
  }

  onPreviewReportSubmit() {
    this.modalService.create<ModelsComponent>({
      nzTitle: '',
      nzContent: ModelsComponent,
      nzWidth: 444,
      nzFooter: null,
      nzComponentParams: {
        modelType: "success",
        modelTitle: "Thank you. Email has been sent successfully",
        modelSubTitle: ""
      }
    });
  }

}
