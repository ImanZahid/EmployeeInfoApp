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
        this.employees = data.map((employee) => ({
          ...employee,
          entryDate: this.formatDate(employee.entryDate),
          leaveDate:
            employee.leaveDate && employee.leaveDate !== '-'
              ? this.formatDate(employee.leaveDate)
              : null,
        }));
      },
      (error) => {
        console.error('Error fetching employees', error);
      }
    );
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onAddEmployee(): void {
    this.router.navigate(['/new-employee']);
  }

  onEditEmployee(employee: Employee): void {
    this.router.navigate([`/employee/${employee.id}`]);
  }

  onDeleteEmployee(id: string): void {
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

  updateSelectedEmployees(employee: Employee, checked: boolean): void {
    if (checked) {
      this.selectedEmployees.push(employee);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (e) => e.id !== employee.id
      );
    }
  }

  hasSelectedEmployees(): boolean {
    return this.selectedEmployees.length > 0;
  }

  toggleSelectAll(event: any): void {
    this.allChecked = event.checked;
    this.selectedEmployees = this.allChecked ? [...this.employees] : [];
    this.employees.forEach((employee) => (employee.selected = this.allChecked));
  }
}
