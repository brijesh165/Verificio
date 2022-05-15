import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

// export interface StepType {
//   label: string;
//   fields: FormlyFieldConfig[];
// }

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  activedStep: any = 0;
  registrationForm: any = FormGroup;
  organizationForm: any = FormGroup;

  isModalVisible: any = false;
  isSuccessModalVisible: any = false;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      phoneNumberPrefix: ['+86', [Validators.required]],
      phone: [null, [Validators.required]],
      plan: [null, [Validators.required]]
    });

    this.organizationForm = this.fb.group({
      companyName: [null, [Validators.required]],
      jobRole: [null, [Validators.required]],
      companySize: [null, [Validators.required]],
      industry: [null, [Validators.required]]
    })
  }

  pre(): void {
    this.activedStep -= 1;
  }

  next(): void {
    this.activedStep += 1;
  }

  done(): void {
    console.log('done');
    this.isModalVisible = true;
  }

  submitForm(): void {
    console.log("Submit form");
  }

  planChange(value: string): void {
    console.log("Value: ", value);
  }

  onOtpChange(event: any): void {
    console.log("Event: ", event);
  }

  onLogin(): void {
    console.log("On Login")
    this.router.navigateByUrl("/auth")
  }

  onOtpDone(): void {
    this.isModalVisible = false;
    this.isSuccessModalVisible = true;
  }
}
