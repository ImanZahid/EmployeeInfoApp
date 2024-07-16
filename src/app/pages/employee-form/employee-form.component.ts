import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, Department } from '../../models/employee.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  departments = [
    { label: 'HR', value: Department.HR },
    { label: 'IT', value: Department.IT },
    { label: 'Sales', value: Department.Sales },
    { label: 'Marketing', value: Department.Marketing },
  ];
  employeeId!: string;
  isEditMode = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((language) => {
        this.translate.use(language);
      });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.employeeId;
    this.initForm();
    if (this.isEditMode) {
      this.loadAndSetEmployee();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      status: [true, Validators.required],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(256),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(256),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.uniqueEmailValidator.bind(this),
        ],
      ],
      department: [null, Validators.required],
      salary: [null, Validators.required],
      entryDate: [null, Validators.required],
      leaveDate: [null],
    });

    this.employeeForm
      .get('status')!
      .valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.employeeForm.get('leaveDate')!.clearValidators();
        } else {
          this.employeeForm
            .get('leaveDate')!
            .setValidators([Validators.required]);
        }
        this.employeeForm.get('leaveDate')!.updateValueAndValidity();
      });
  }

  loadAndSetEmployee(): void {
    this.employeeService
      .getEmployee(this.employeeId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (employee) => {
          const leaveDate =
            employee.leaveDate && employee.leaveDate !== '-'
              ? new Date(employee.leaveDate)
              : null;
          this.employeeForm.patchValue({
            ...employee,
            status: Boolean(employee.status),
            entryDate: new Date(employee.entryDate),
            leaveDate: leaveDate,
            department:
              this.departments.find(
                (dept) => dept.value === employee.department
              ) || null,
          });
        },
        (error) => {
          console.error('Error fetching employee', error);
        }
      );
  }

  uniqueEmailValidator(control: AbstractControl): ValidationErrors | null {
    const currentEmployees = this.employeeService.getCurrentEmployees();
    const emailExists = currentEmployees.some(
      (employee) =>
        employee.email === control.value && employee.id !== this.employeeId
    );
    return emailExists ? { emailExists: true } : null;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.employeeForm.valid) {
      const formValue = { ...this.employeeForm.value, id: this.employeeId };

      formValue.department = this.employeeForm.value.department.value;

      if (!formValue.leaveDate) {
        formValue.leaveDate = '-';
      }
      if (this.isEditMode) {
        this.employeeService.updateEmployee(formValue).subscribe(() => {
          this.router.navigate(['/list']);
        });
      } else {
        this.employeeService.addEmployee(formValue).subscribe(() => {
          this.router.navigate(['/list']);
        });
      }
    }
  }

  onBack(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/list']);
  }
}
