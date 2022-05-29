import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  @Input() modelType: string = "";
  @Input() modelTitle: string = "";
  @Input() modelSubTitle: string = "";
  otp: any = "";

  constructor(private modal: NzModalRef) { }

  ngOnInit(): void {
  }

  onSuccessOk() {
    this.modal.close(true);
  }

  onDeactivateCancel() {
    this.modal.close();
  }

  onDeactivateYes() {
    this.modal.close(true);
  }

  onLogin() {
    this.modal.close(true);
  }

}
