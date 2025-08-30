import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './UASM/login/login.component';
import {SigninComponent} from './UASM/signin/signin.component';
import {ListuserComponent} from './UASM/listuser/listuser.component';


import {VehicleComponent} from './vehicle/vehicle.component';
import {EmployeeComponent} from './employee/employee.component';


const routes: Routes = [
  // Alterar o redirecionamento para 'login' como a rota inicial
  {path: '', pathMatch: 'full', redirectTo: '/login'},

  {path: 'login', component: LoginComponent},
  {path: 'register', component: SigninComponent},
  {path: 'employee', component: EmployeeComponent},
  {path: 'users', component: ListuserComponent},


  {path: 'vehicles', component: VehicleComponent},
  {path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
