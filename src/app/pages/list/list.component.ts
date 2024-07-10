import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  selectedEmployees: Employee[] = [];
  allChecked = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((language) => {
        this.translate.use(language);
      });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  switchLanguage(): void {
    const newLanguage =
      this.languageService.getLanguage() === 'en' ? 'tr' : 'en';
    this.languageService.setLanguage(newLanguage);
  }

  getLanguageButtonLabel(): string {
    return this.languageService.getLanguage() === 'en' ? 'TR' : 'EN';
  }

  getEmployees(): void {
    this.employeeService
      .getEmployees()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
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
      message: this.translate.instant('DELETE_CONFIRMATION'),
      header: this.translate.instant('CONFIRMATION'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      acceptButtonStyleClass: 'p-button-text p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.onDeleteEmployee(employee.id);
      },
    });
  }

  confirmDeleteSelected(): void {
    this.confirmationService.confirm({
      message: this.translate.instant('DELETE_SELECTED_CONFIRMATION'),
      header: this.translate.instant('CONFIRMATION'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
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
          summary: this.translate.instant('Success'),
          detail: this.translate.instant('Employee deleted successfully'),
        });
      },
      (error) => {
        console.error('Error deleting employee', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('Error'),
          detail: this.translate.instant('Error deleting employee'),
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
          summary: this.translate.instant('Success'),
          detail: this.translate.instant(
            'Selected employees deleted successfully'
          ),
        });
      },
      (error) => {
        console.error('Error deleting employees', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('Error'),
          detail: this.translate.instant('Error deleting selected employees'),
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
