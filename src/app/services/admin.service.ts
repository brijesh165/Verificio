import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  baseUrl: string = `${environment.apiUrl}/`;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  });


  // companies
  getCompanyList(params: any) {
    return this.http.post(this.baseUrl + 'company/list', params)
  }

  getCompanyById(id: any) {
    return this.http.get(this.baseUrl + `company/${id}`)
  }

  suspendCompany(params: any) {
    return this.http.post(this.baseUrl + 'company/suspend', params);
  }

  suspenstionEmail(params: any) {
    return this.http.post(this.baseUrl + 'company/send-email', params);
  }

  unSuspendCompany(params: any) {
    return this.http.post(this.baseUrl + 'company/unsuspend', params);
  }


  // subscriptions
  getSubscribtionPlans() {
    return this.http.get(this.baseUrl + 'subscription/plan/list/all');
  }

  getPlanInfo(params: any) {
    return this.http.get(this.baseUrl + `subscription/plan/${params}`);
  }

  createSubscriptionPlan(params: any) {
    return this.http.post(this.baseUrl + 'subscription/plan/update', params);
  }

  updateSubscriptionPlan(payload: any) {
    const { planId, params } = payload;
    return this.http.post(this.baseUrl + `subscription/plan/update/${planId}`, params);
  }

  deleteSubscriptionPlan(params: any) {
    return this.http.delete(this.baseUrl + `subscription/plan/archive/${params}`);
  }


  // reports
  getAllReportType() {
    return this.http.get(this.baseUrl + 'report/type/all');
  }

  createReportType(params: any) {
    return this.http.post(this.baseUrl + `report/type/create`, params);
  }

  updateReportType(params: any) {
    return this.http.post(this.baseUrl + `report/type/update`, params);
  }

  activateReportType(params: any) {
    return this.http.post(this.baseUrl + `report/type/untrash`, params);
  }

  deleteReportType(params: any) {
    return this.http.post(this.baseUrl + `report/type/delete`, params)
  }


  // Users
  getAllUsers() {
    return this.http.get(this.baseUrl + 'user/admin/list');
  }

  createUser(params: any) {
    return this.http.post(this.baseUrl + 'user/admin/create', params);
  }

  updateUser(payload: any) {
    const { id, params } = payload;

    return this.http.put(this.baseUrl + `user/admin/update/${id}`, params);
  }

  deleteUser(payload: any) {
    const { id, params } = payload;
    return this.http.post(this.baseUrl + `user/admin/archive/${id}`, params);
  }

  // Terms of Use
  getTerms() {
    return this.http.get(this.baseUrl + 'page/terms');
  }

  updateTerms(params: any) {
    return this.http.post(this.baseUrl + 'page/update/terms', params);
  }
}
