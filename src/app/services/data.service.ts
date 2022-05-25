import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://54.157.195.180/';
  // baseUrl: string = 'http://192.168.75.137:3000';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  });

  createEmployee(params: any) {
    return this.http.post(this.baseUrl + "user/employees/create", params)
  }

  listEmployee() {
    return this.http.get(this.baseUrl + "user/employees/list")
  }

  deleteEmployee(params: any) {
    return this.http.post(this.baseUrl + "user/employees/archive", params);
  }

  reportTypeList() {
    return this.http.get(this.baseUrl + "report/type/all");
  }

  listReport() {
    return this.http.get(this.baseUrl + "report/company/list");
  }

  createReport(params: any) {
    return this.http.post(this.baseUrl + "report/type/create", params);
  }

  updateReport(params: any) {
    return this.http.post(this.baseUrl + "report/type/update", params);
  }

  archiveReport(params: any) {
    return this.http.post(this.baseUrl + "report/type/delete", params)
  }
} 
