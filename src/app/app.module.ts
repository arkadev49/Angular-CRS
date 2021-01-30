import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { PoliceRegisterComponent } from './admin/police-register/police-register.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AlertComponent } from './ui/alert/alert.component'
import { LoadingComponent } from './ui/loading/loading.component'
import { FormsModule } from '@angular/forms'
import { ComplaintsComponent } from './police/complaints/complaints.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ComplaintComponent } from './police/complaint/complaint.component'
import { AuthInterceptorService } from './auth/auth-interceptor.service'
import { PoliceComponent } from './police/police.component'
import { ModalComponent } from './police/complaint/modal/modal.component'
import { HeaderComponent } from './header/header.component'
import { RegisterPSComponent } from './admin/register-ps/register-ps.component'
import { AdminComponent } from './admin/admin.component'
import { ResolveComplaintComponent } from './police/resolve-complaint/resolve-complaint.component'
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PoliceRegisterComponent,
    AlertComponent,
    LoadingComponent,
    ComplaintsComponent,
    ComplaintComponent,
    PoliceComponent,
    ModalComponent,
    HeaderComponent,
    RegisterPSComponent,
    AdminComponent,
    ResolveComplaintComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    HomeComponent,
    AboutComponent,
    DownloadsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
