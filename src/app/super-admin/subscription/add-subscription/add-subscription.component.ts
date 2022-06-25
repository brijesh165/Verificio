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

  listOfOption: string[] = [];
  listOfTagOptions = [];

  isEdit: any = false;
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
      basicPlanPriceNGN: [null, [Validators.required]],
      sellingPlanPriceNGN: [null, [Validators.required]],
      basicPlanPriceUSA: [null, [Validators.required]],
      sellingPlanPriceUSA: [null, [Validators.required]],
      noOfUser: [null, [Validators.required]],
      features: [this.listOfOption, [Validators.required]],
    })

    if (this.paramsFromParent.isEdit) {
      this.getInfoForPlan(this.paramsFromParent.id)
      this.isEdit = true;
    }
  }

  getInfoForPlan(id: any) {
    this.adminService.getPlanInfo(id)
      .subscribe((res: any) => {
        if (res.status === "success") {

          this.listOfOption = res.data?.benefits;
          this.subscriptionForm.patchValue({
            name: res.data?.name,
            subHeader: res.data?.subtitle,
            basicPlanPriceNGN: res.data?.basePrices?.NGN,
            sellingPlanPriceNGN: res.data?.basePrices?.USD,
            basicPlanPriceUSA: res.data?.prices?.NGN,
            sellingPlanPriceUSA: res.data?.prices?.USD,
            noOfUser: res.data?.maxEmployees,
            features: this.listOfOption,
          })
        }
      })
  }

  onAddNewPlan() {
    const params = {
      name: this.subscriptionForm.value.name,
      subtitle: this.subscriptionForm.value.subHeader,
      basePrices: {
        NGN: this.subscriptionForm.value.basicPlanPriceNGN,
        USD: this.subscriptionForm.value.basicPlanPriceUSA
      },
      prices: {
        NGN: this.subscriptionForm.value.sellingPlanPriceNGN,
        USD: this.subscriptionForm.value.sellingPlanPriceUSA
      },
      benefits: this.subscriptionForm.value.features,
      maxEmployees: this.subscriptionForm.value.noOfUser,
    }

    if (this.isEdit) {
      this.adminService.updateSubscriptionPlan({
        "planId": this.paramsFromParent.id,
        "params": params
      })
        .subscribe((res: any) => {
          if (res.status === "success") {
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

            this.router.navigate(["/admin/subscriptions"])
          }
        })

    } else {
      this.adminService.createSubscriptionPlan(params)
        .subscribe((res: any) => {
          if (res.status === "success") {
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

            this.router.navigate(["/admin/subscriptions"])
          }
        })
    }
  }

}
