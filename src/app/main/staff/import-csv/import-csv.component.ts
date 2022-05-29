import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.scss']
})
export class ImportCsvComponent implements OnInit {

  csvImportPath : string = `${environment.apiUrl}/user/employees/import`
  authToken : string = `Bearer ${localStorage.getItem('token')}`;
  sampleCSVPath : string = `${environment.apiUrl}/sample/employee-import.csv`;

  constructor(private messageService: NzMessageService, private modal: NzModalRef) { }

  ngOnInit(): void {
  }

  handleChange(info: NzUploadChangeParam):void{
    if (info.file.status === 'done') {
      this.messageService.success(`${info.file.name} file uploaded successfully`);
      this.modal.close();
    } else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    }
  }

}
