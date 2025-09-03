import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './UASM/login/login.component';
import {SigninComponent} from './UASM/signin/signin.component';
import {ListuserComponent} from './UASM/listuser/listuser.component';
import {VehicleComponent} from './vehicle/vehicle.component';
import {EmployeeComponent} from './employee/employee.component';
import {ProductComponent} from './product/product.component';
import {CustomerComponent} from './customer/customer.component';
import {BookComponent} from './book/book.component';
import {PedidoComponent} from './pedido/pedido.component';


const routes: Routes = [
  // Alterar o redirecionamento para 'login' como a rota inicial
  {path: '', pathMatch: 'full', redirectTo: '/login'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SigninComponent},
  {path: 'employee', component: EmployeeComponent},
  {path:'product', component: ProductComponent},
  {path: 'users', component: ListuserComponent},
  {path: 'vehicles', component: VehicleComponent},
  {path: 'customer', component:CustomerComponent},
  {path: 'book', component:BookComponent},
  {path: 'pedido', component:PedidoComponent},
  {path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
