import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root', // making it available throughout the application
})
export class EmployeeService {
  private apiURL = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiURL).pipe(
      map((employees) =>
        employees.map((employee) => ({
          ...employee,
          id: Number(employee.id), // Ensure ID is a number
        }))
      )
    );
  }

  getEmployee(id: number): Observable<Employee> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Employee>(url).pipe(
      map((employee) => ({
        ...employee,
        id: Number(employee.id), // Ensure ID is a number
      }))
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
    };

    return this.http.get<Employee[]>(this.apiURL).pipe(
      map((employees) => {
        employee.id = this.generateUniqueId(employees);
        return employee;
      }),
      switchMap((newEmployee) =>
        this.http.post<Employee>(this.apiURL, newEmployee, httpOptions)
      )
    );
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const URL = `${this.apiURL}/${employee.id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
    };
    return this.http.put<Employee>(URL, employee, httpOptions);
  }

  deleteEmployee(id: number): Observable<Employee> {
    const URL = `${this.apiURL}/${id}`;
    return this.http.delete<Employee>(URL);
  }

  private generateUniqueId(employees: Employee[]): number {
    let uniqueId: number;
    const ids = employees.map((emp) => Number(emp.id));
    do {
      uniqueId = Math.floor(100000000 + Math.random() * 900000000);
    } while (ids.includes(uniqueId));
    return uniqueId;
  }
}
