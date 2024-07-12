import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AuthGuard } from './services/auth.gaurd';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'list', component: ListComponent, canActivate: [AuthGuard] },
  {
    path: 'new-employee',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employee/:id',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
