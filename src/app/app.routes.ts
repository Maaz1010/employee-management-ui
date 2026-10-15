import { Routes } from '@angular/router';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeForm } from './components/employee-form/employee-form';
import { EmployeeDetail } from './components/employee-detail/employee-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeList },
  { path: 'employees/new', component: EmployeeForm },
  { path: 'employees/:id/edit', component: EmployeeForm },
  { path: 'employees/:id', component: EmployeeDetail },
  { path: '**', redirectTo: 'employees' },
];