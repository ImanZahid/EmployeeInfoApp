import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, Department } from '../../models/employee.model';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  departments = [
    { label: 'HR', value: Department.HR },
    { label: 'IT', value: Department.IT },
    { label: 'Sales', value: Department.Sales },
    { label: 'Marketing', value: Department.Marketing },
  ];
  employeeId!: number;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.params['id'];
    this.initForm();
    this.loadEmployee();
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

  loadEmployee(): void {
    this.employeeService.getEmployee(this.employeeId).subscribe(
      (employee) => {
        const leaveDate =
          employee.leaveDate && employee.leaveDate !== '-'
            ? new Date(employee.leaveDate)
            : null;
        this.employeeForm.patchValue({
          ...employee,
          status: Boolean(employee.status), // Ensure status is a boolean
          entryDate: new Date(employee.entryDate),
          leaveDate: leaveDate,
        });
      },
      (error) => {
        console.error('Error fetching employee', error);
      }
    );
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = { ...this.employeeForm.value, id: this.employeeId };
      if (!formValue.leaveDate) {
        formValue.leaveDate = '-';
      }
      this.employeeService.updateEmployee(formValue).subscribe(() => {
        this.router.navigate(['/list']);
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/list']);
  }
}
