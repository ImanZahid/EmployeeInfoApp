export interface Employee {
  id: string;
  status: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  department: Department;
  salary: number;
  entryDate: string;
  leaveDate?: string | null;
  selected?: boolean;
}

export enum Department {
  HR = 'HR',
  IT = 'IT',
  Sales = 'Sales',
  Marketing = 'Marketing',
}
