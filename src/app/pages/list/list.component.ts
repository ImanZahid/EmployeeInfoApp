import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ListComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployees: Employee[] = [];
  allChecked = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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

  confirmDelete(employee: Employee): void {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-text p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.onDeleteEmployee(employee.id);
      },
    });
  }

  confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected employees?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-text p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.onDeleteSelected();
      },
    });
  }

  onDeleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe(
      () => {
        this.getEmployees();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee deleted successfully',
        });
      },
      (error) => {
        console.error('Error deleting employee', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting employee',
        });
      }
    );
  }

  onDeleteSelected(): void {
    const deleteRequests = this.selectedEmployees.map((employee) =>
      this.employeeService.deleteEmployee(employee.id)
    );

    Promise.all(deleteRequests).then(
      () => {
        this.getEmployees();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Selected employees deleted successfully',
        });
      },
      (error) => {
        console.error('Error deleting employees', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting selected employees',
        });
      }
    );
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
