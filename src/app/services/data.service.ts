import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) { }

  baseUrl: string = `${environment.apiUrl}/`;
  // baseUrl: string = 'http://192.168.75.137:3000';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  });

  getDashboardData() {
    return this.http.get(this.baseUrl + `user/dashboard`);
  }

  getNotificationList() {
    return this.http.get(this.baseUrl + `notification/list`);
  }

  getEmployeeDetailsById(params: any) {
    return this.http.get(this.baseUrl + `user/employees/${params}`);
  }

  updateProfile(params: any) {
    return this.http.post(this.baseUrl + 'user/profile', params);
  }

  uploadCompanyProof(params: any) {
    console.log("Params: ", params)
    return this.http.post(this.baseUrl + `company/update/proof/${params.id}`, params.formData)
  }

  updateBusinessProfile(params: any) {
    return this.http.post(this.baseUrl + 'company/update', params);
  }

  createEmployee(params: any) {
    return this.http.post(this.baseUrl + 'user/employees/create', params);
  }

  updateEmployee(params: any) {
    return this.http.put(
      this.baseUrl + `user/employees/${params.id}`,
      params.body
    );
  }

  getCompanyById(companyId: string) {
    return this.http.get(this.baseUrl + `company/${companyId}`);
  }

  approveEmployeeProfileChange(params: any) {
    return this.http.post(this.baseUrl + 'user/profile/approve', params);
  }

  listEmployee() {
    return this.http.get(this.baseUrl + 'user/employees/list');
  }

  deleteEmployee(params: any) {
    return this.http.post(this.baseUrl + 'user/employees/archive', params);
  }

  activateEmployee(params: any) {
    return this.http.post(this.baseUrl + 'user/employees/activate', params);
  }

  reportTypeList() {
    return this.http.get(this.baseUrl + 'report/type/all');
  }

  listReport() {
    return this.http.get(this.baseUrl + 'report/company/list');
  }

  createReport(params: any) {
    return this.http.post(this.baseUrl + 'report/create', params);
  }

  reportAction(params: any) {
    return this.http.post(this.baseUrl + 'report/approve', params);
  }

  updateReport(params: any) {
    return this.http.post(this.baseUrl + 'report/type/update', params);
  }

  archiveReport(params: any) {
    return this.http.post(this.baseUrl + 'report/type/delete', params);
  }

  search(params: any) {
    return this.http.post(this.baseUrl + 'search', params);
  }

  searchDetails(params: any) {
    return this.http.get(this.baseUrl + `search/${params.id}`)
  }
}
