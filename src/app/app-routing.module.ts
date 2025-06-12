import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {SigninComponent} from './signin/signin.component';
import {ListuserComponent} from './listuser/listuser.component';

import {CarloadComponent} from './carload/carload.component';
import {ManagerComponent} from './manager/manager.component';
import {SprintComponent} from './sprint/sprint.component';
import {DriverComponent} from './driver/driver.component';
import {SprintDetailsComponent} from './sprint/sprint-details/sprint-details.component';

const routes: Routes = [
  // Alterar o redirecionamento para 'login' como a rota inicial
  {path: '', pathMatch: 'full', redirectTo: '/login'},
  {path: 'carload', component: CarloadComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SigninComponent},
  {path: 'users', component: ListuserComponent},

  {path: 'manager', component: ManagerComponent},
  {path: 'sprint', component: SprintComponent},
  {path: 'sprint-detail/:id', component: SprintDetailsComponent},
  {path: 'driver', component: DriverComponent},
  {path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
