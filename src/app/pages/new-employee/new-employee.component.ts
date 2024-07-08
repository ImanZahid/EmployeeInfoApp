import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Department } from '../../models/employee.model';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css'],
})
export class NewEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  departments = [
    { label: 'HR', value: Department.HR },
    { label: 'IT', value: Department.IT },
    { label: 'Sales', value: Department.Sales },
    { label: 'Marketing', value: Department.Marketing },
  ];

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

    this.employeeForm.get('status')!.valueChanges.subscribe((value) => {
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

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = { ...this.employeeForm.value };
      if (!formValue.leaveDate) {
        formValue.leaveDate = '-';
      }
      this.employeeService.addEmployee(formValue).subscribe(() => {
        this.router.navigate(['/list']);
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/list']);
  }
}
