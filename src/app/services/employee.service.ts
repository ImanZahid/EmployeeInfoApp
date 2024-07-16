import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiURL = 'http://localhost:3000/employees';
  private employeesSubject: BehaviorSubject<Employee[]> = new BehaviorSubject<
    Employee[]
  >([]);

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    if (this.employeesSubject.getValue().length) {
      return this.employeesSubject.asObservable();
    } else {
      return this.http.get<Employee[]>(this.apiURL).pipe(
        map((employees) => {
          this.employeesSubject.next(employees);
          return employees;
        }),
        delay(2000)
      );
    }
  }

  getEmployee(id: string): Observable<Employee> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Employee>(url);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
    };

    return this.getEmployees().pipe(
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
    const url = `${this.apiURL}/${employee.id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
    };
    return this.http.put<Employee>(url, employee, httpOptions);
  }

  deleteEmployee(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<void>(url).pipe(
      map(() => {
        const employees = this.employeesSubject
          .getValue()
          .filter((emp) => emp.id !== id);
        this.employeesSubject.next(employees);
      })
    );
  }

  private generateUniqueId(employees: Employee[]): string {
    let uniqueId: string;
    const ids = employees.map((emp) => String(emp.id));
    do {
      uniqueId = String(Math.floor(100000000 + Math.random() * 900000000));
    } while (ids.includes(uniqueId));
    return uniqueId;
  }

  setEmployees(employees: Employee[]): void {
    this.employeesSubject.next(employees);
  }

  getEmployeesData(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  getCurrentEmployees(): Employee[] {
    return this.employeesSubject.getValue();
  }
}
