import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { NewEmployeeComponent } from './pages/new-employee/new-employee.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AuthGuard } from './services/auth.gaurd';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'list', component: ListComponent, canActivate: [AuthGuard] },
  {
    path: 'new-employee',
    component: NewEmployeeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employee/:id',
    component: EditEmployeeComponent,
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
