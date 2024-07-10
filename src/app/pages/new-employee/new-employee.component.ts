import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Department } from '../../models/employee.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css'],
})
export class NewEmployeeComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  departments = [
    { label: 'HR', value: Department.HR },
    { label: 'IT', value: Department.IT },
    { label: 'Sales', value: Department.Sales },
    { label: 'Marketing', value: Department.Marketing },
  ];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      status: [true],
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
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      department: [Department.HR, Validators.required],
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.employeeForm.valid) {
      const formValue = { ...this.employeeForm.value };

      formValue.department = this.employeeForm.value.department.value;

      if (!formValue.leaveDate) {
        formValue.leaveDate = '-';
      }
      this.employeeService.addEmployee(formValue).subscribe(() => {
        this.router.navigate(['/list']);
      });
    }
  }

  onBack(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/list']);
  }
}
