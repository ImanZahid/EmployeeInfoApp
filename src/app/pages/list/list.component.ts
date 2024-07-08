import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployees: Employee[] = [];
  allChecked = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error fetching employees', error);
      }
    );
  }

  onAddEmployee(): void {
    this.router.navigate(['/new-employee']);
  }

  onEditEmployee(employee: Employee): void {
    this.router.navigate([`/employee/${employee.id}`]);
  }

  onDeleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(
      () => {
        this.getEmployees();
      },
      (error) => {
        console.error('Error deleting employee', error);
      }
    );
  }

  onDeleteSelected(): void {
    this.selectedEmployees.forEach((employee) => {
      this.employeeService.deleteEmployee(employee.id).subscribe(
        () => {
          this.getEmployees();
        },
        (error) => {
          console.error('Error deleting employee', error);
        }
      );
    });
  }

  toggleSelectAll(event: any): void {
    this.employees.forEach((employee) => (employee.selected = event.checked));
    this.selectedEmployees = event.checked ? [...this.employees] : [];
  }
}
