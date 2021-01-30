import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { PoliceRegisterComponent } from './admin/police-register/police-register.component'
import { ComplaintsComponent } from './police/complaints/complaints.component'
import { ComplaintComponent } from './police/complaint/complaint.component'
import { PoliceGuard } from './auth/police.guard'
import { AdminGuard } from './auth/admin.guard'
import { PoliceComponent } from './police/police.component'
import { RegisterPSComponent } from './admin/register-ps/register-ps.component'
import { AdminComponent } from './admin/admin.component'
import { ResolveComplaintComponent } from './police/resolve-complaint/resolve-complaint.component'
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component'
import { ForgetPasswordComponent } from './forget-password/forget-password.component'
import { HomeComponent } from './home/home.component'
import { AboutComponent } from './about/about.component'
import { DownloadsComponent } from './downloads/downloads.component'

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'police',
    component: PoliceComponent,
    canActivate: [PoliceGuard],
    children: [
      {
        path: 'complaints',
        component: ComplaintsComponent,
      },
      {
        path: 'complaints/:id',
        component: ComplaintComponent,
      },
      {
        path: 'complaint/:id/resolve',
        component: ResolveComplaintComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'register-ps',
        component: RegisterPSComponent,
      },
      {
        path: 'police/register',
        component: PoliceRegisterComponent,
      },
    ],
  },
  { path: 'about', component: AboutComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'download', component: DownloadsComponent },
  { path: '**', redirectTo: '/login' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
