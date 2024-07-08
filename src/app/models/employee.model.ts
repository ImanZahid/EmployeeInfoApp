export interface Employee {
  id: number;
  status: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  department: Department;
  salary: number;
  entryDate: string;
  leaveDate?: string; // making it optional
  selected?: boolean;
}

export enum Department {
  HR = 'HR',
  IT = 'IT',
  Sales = 'Sales',
  Marketing = 'Marketing',
}
