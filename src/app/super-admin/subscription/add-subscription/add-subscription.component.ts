import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from 'src/app/services/admin.service';
import { ModelsComponent } from '../../models/models.component';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.scss']
})
export class AddSubscriptionComponent implements OnInit {

  subscriptionForm: any = FormGroup;

  paramsFromParent: any;
  planFeatures: any = [
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" },
    { label: "Allow messages from companies", value: "allow_message" }
  ]

  constructor(private fb: FormBuilder, private adminService: AdminService,
    private modalService: NzModalService, private router: Router) {
    const routeParams: any = this.router.getCurrentNavigation();
    this.paramsFromParent = routeParams.extras.state;
  }

  ngOnInit(): void {

    this.subscriptionForm = this.fb.group({
      name: [null, [Validators.required]],
      subHeader: [null, [Validators.required]],
      planPrice: [null, [Validators.required]],
      noOfUser: [null, [Validators.required]],
      features: [this.planFeatures, [Validators.required]],
      aboutThePlan: [null, [Validators.required]]
    })

    if (this.paramsFromParent.isEdit) {
      this.getInfoForPlan(this.paramsFromParent.id)
    }
  }

  getInfoForPlan(id: any) {
    console.log("Id: ", id);
  }

  onAddNewPlan() {
    const params = {
      name: this.subscriptionForm.control.value
    }

    this.modalService.create<ModelsComponent>({
      nzTitle: '',
      nzContent: ModelsComponent,
      nzWidth: 444,
      nzFooter: null,
      nzComponentParams: {
        modelType: "success",
        modelTitle: "Plan has been created",
        modelSubTitle: ""
      }
    });

    // this.adminService.createSubscriptionPlan(params)
    //   .subscribe((res: any) => {
    //     console.log("Response: ", res);
    //   })
  }

}
