import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root', // making it available throughout the application.
})
export class EmployeeService {
  private apiURL = 'http://localhost:3000/employees';
  constructor(private http: HttpClient) {}

  //Getting all the employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiURL);
  }

  //Getting employees by their id number
  getEmployee(id: number): Observable<Employee> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Employee>(url);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
    };
    return this.http.post<Employee>(this.apiURL, employee, httpOptions);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const URL = `${this.apiURL}/${employee.id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
    };
    return this.http.post<Employee>(URL, employee, httpOptions);
  }

  deleteEmployee(id: number): Observable<Employee> {
    const URL = `{this.apiUrl}/${id}`;
    return this.http.delete<Employee>(URL);
  }
}
