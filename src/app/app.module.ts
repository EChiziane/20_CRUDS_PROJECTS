import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration, withEventReplay} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IconsProviderModule} from './icons-provider.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {en_US, provideNzI18n} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';

import {NzAutosizeDirective, NzInputDirective, NzInputGroupComponent, NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonComponent, NzButtonModule} from 'ng-zorro-antd/button';
import {NzDatePickerComponent, NzDatePickerModule, NzRangePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzFilterTriggerComponent, NzTableModule, NzThAddOnComponent} from 'ng-zorro-antd/table';

import {NzDrawerComponent, NzDrawerContentDirective, NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzSelectComponent, NzSelectModule} from 'ng-zorro-antd/select';
import {NzFormDirective, NzFormModule} from 'ng-zorro-antd/form';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzDividerComponent} from 'ng-zorro-antd/divider';

import {NzSwitchComponent, NzSwitchModule} from 'ng-zorro-antd/switch';

import {NzTagComponent} from 'ng-zorro-antd/tag';
import {AuthInterceptor} from './interceptors/auth-interceptor';
import {LoginComponent} from './UASM/login/login.component';
import {NzAlertComponent} from 'ng-zorro-antd/alert';
import {NzCheckboxComponent} from 'ng-zorro-antd/checkbox';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';

import {ListuserComponent} from './UASM/listuser/listuser.component';
import {SigninComponent} from './UASM/signin/signin.component';
import {NzStatisticComponent} from 'ng-zorro-antd/statistic';

import {NzPageHeaderComponent, NzPageHeaderContentDirective} from 'ng-zorro-antd/page-header';
import {NzSpaceComponent, NzSpaceItemDirective} from 'ng-zorro-antd/space';
import {NzDescriptionsComponent, NzDescriptionsItemComponent} from 'ng-zorro-antd/descriptions';

import {NzCalendarComponent} from 'ng-zorro-antd/calendar';

import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';


import {VehicleComponent} from './vehicle/vehicle.component';
import {EmployeeComponent} from './employee/employee.component';
import {ProductComponent} from './product/product.component';
import {CustomerComponent} from './customer/customer.component';
import {BookComponent} from './book/book.component';
import {PedidoComponent} from './pedido/pedido.component';
import {ReservationComponent} from './reservation/reservation.component';


registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    SigninComponent,
    ListuserComponent,
    VehicleComponent,
    EmployeeComponent,
    ProductComponent,
    CustomerComponent,
    BookComponent,
PedidoComponent,
    ReservationComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    HttpClientModule,
    NzLayoutModule,
    NzDropDownModule,
    NzMenuModule,
    FormsModule,
    NzInputDirective,
    NzButtonComponent,
    NzDividerComponent,
    NzTableModule,
    NzLayoutModule,
    NzDropDownModule,
    NzMenuModule,
    FormsModule,
    NzInputDirective,
    NzButtonComponent,
    NzDividerComponent,
    NzTableModule,
    NzFilterTriggerComponent,
    NzThAddOnComponent,
    NzRowDirective,
    NzColDirective,
    NzCardComponent,
    NzDrawerComponent,
    NzFormDirective,
    NzInputGroupComponent,
    NzSelectComponent,
    NzRangePickerComponent,
    NzAutosizeDirective,
    NzDrawerContentDirective,
    NzDatePickerComponent,
    NzButtonModule,
    NzDrawerModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzSwitchComponent,
    NzTagComponent,
    NzAlertComponent,
    NzCheckboxComponent,
    NzModalModule,
    NzAvatarModule,
    NzSwitchModule,
    NzStatisticComponent,
    NzCalendarComponent,
    NzFilterTriggerComponent,
    NzThAddOnComponent,
    NzRowDirective,
    NzColDirective,
    NzCardComponent,
    NzDrawerComponent,
    NzFormDirective,
    NzInputGroupComponent,
    NzSelectComponent,
    NzRangePickerComponent,
    NzAutosizeDirective,
    NzDrawerContentDirective,
    NzDatePickerComponent,
    NzButtonModule,
    NzDrawerModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzSwitchComponent,
    NzTagComponent,
    NzAlertComponent,
    NzCheckboxComponent,
    NzModalModule,
    NzAvatarModule,
    NzSwitchModule,
    NzStatisticComponent,
    NzCalendarComponent,
    NzPageHeaderComponent,
    NzSpaceComponent,
    NzPageHeaderContentDirective,
    NzSpaceItemDirective,
    NzDescriptionsComponent,
    NzDescriptionsItemComponent,
    MatLabel,
    MatInput,
    MatFormField,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSelect,
    MatOption,
    MatButton
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideClientHydration(withEventReplay()),
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),


  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
