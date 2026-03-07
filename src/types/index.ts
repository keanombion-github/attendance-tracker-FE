export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  clockIn: Date;
  clockOut?: Date;
  date: string;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'partial';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'employee';
  employeeId?: string;
}