import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EntraUsersPage } from './pages/entra-users-page/entra-users-page';
import { EmployeesPage } from './pages/employees-page/employees-page';
import { EmployeeProfilePage } from './pages/employee-profile-page/employee-profile-page';
import { NoAccountPage } from './pages/forbidden/no-account-page/no-account-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },
  {
    path: 'entra-users',
    component: EntraUsersPage,
  },
  {
    path: 'employees',
    component: EmployeesPage,
  },
  {
    path: 'employees/:id',
    component: EmployeeProfilePage,
  },
  {
    path: 'forbidden/no-account',
    component: NoAccountPage,
    data: { hideHeader: true },
  },
];
