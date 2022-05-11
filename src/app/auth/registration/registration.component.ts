import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm: any = FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      plan: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    console.log("Submit form");
  }

  planChange(value: string): void {
    console.log("Value: ", value);
  }

  onLogin(): void {
    console.log("On Login")
    this.router.navigateByUrl("/auth")
  }
}
