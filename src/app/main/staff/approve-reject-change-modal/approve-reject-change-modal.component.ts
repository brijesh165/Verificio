import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approve-reject-change-modal',
  templateUrl: './approve-reject-change-modal.component.html',
  styleUrls: ['./approve-reject-change-modal.component.scss']
})
export class ApproveRejectChangeModalComponent implements OnInit {

  @Input() userId:string;
  userData:any;
  profileForm: any = FormGroup;
  profileImagePath:string = '';
  constructor(private dataService: DataService,private fb: FormBuilder,private modalRef: NzModalRef, private messageService: NzMessageService) {

  }

  ngOnInit(): void {

    
    this.profileForm = this.fb.group({
      firstName: [{ value: null, disabled: true }, [Validators.required]],
      lastName: [{ value: null, disabled: true }, [Validators.required]],
      email: [{ value: null, disabled: true}, [Validators.required]],
      phoneNumberPrefix: [{value:null, disabled: true}, [Validators.required]],
      phone: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(10)]],
      address: [{ value: null, disabled: true }, [Validators.required]],
      state: [{ value: null, disabled: true }, [Validators.required]],
      stateOfOrigin: [{ value: null, disabled: true }, [Validators.required]],
      lga: [{ value: null, disabled: true }, [Validators.required]],
      dateOfBirth: [{ value: null, disabled: true }, [Validators.required]],
      gender: [{ value: null, disabled: true }, [Validators.required]]
    });

    this.dataService.getEmployeeDetailsById(this.userId).subscribe((res:any) => {
      this.userData = res.data;

      res.data = { ...res.data, ...res.data.changedData };

      if(res.data.changedData==null){
        this.messageService.info(`This review request is already processed.`);
        this.modalRef.close();
      }

      this.profileForm.patchValue({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
        phoneNumberPrefix: res.data.countryCode,
        phone: res.data.phoneNo,
        address: res.data.address?.address,
        state: res.data.address?.state,
        stateOfOrigin: res.data.address?.stateOfOrigin,
        lga: res.data.address?.lga,
        dateOfBirth: res.data.dob ? moment(res.data.dob).toDate() : null,
        gender: res.data.gender
      });

      
      this.profileImagePath = res.data.profilePicture && `${environment.apiUrl}/${res.data.profilePicture}`

    });
  }

  changeApprovalStatus(status: boolean): void {
    this.dataService.approveEmployeeProfileChange({
      userId:this.userId,
      status:status
    }).subscribe((data:any)=>{
      if(data.status ==='success'){
        this.messageService.success(data.message);
        this.modalRef.close();
      }else{
        this.messageService.error(data.message);
      }
    });
  }

}
