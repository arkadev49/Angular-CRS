import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgForm } from '@angular/forms'
import { AuthService } from '../auth/auth.service'
import { take } from 'rxjs/operators'
import { ForgetPasswordService } from '../forget-password/forget-password.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../assets/css/main.css',
    '../../assets/css/bootstrap.min.css',
  ],
})
export class LoginComponent implements OnInit {
  admin: boolean
  forgetPassword = false

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private forgetService: ForgetPasswordService
  ) {}

  ngOnInit(): void {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      if (user) {
        if (user.role === 'POLICE') {
          this.router.navigate(['/police/complaints'])
        } else if (user.role === 'ADMIN') {
          this.router.navigate(['/admin/register-ps'])
        }
      }
    })
    this.forgetService.isOpen.subscribe((open) => {
      this.forgetPassword = open
    })
    this.admin = true
  }

  onToggleRole(form2: NgForm, form1: NgForm, role: boolean): void {
    if (this.admin === role) {
      return
    }
    form1.reset()
    form2.reset()
    this.admin = role
  }

  onAdminLogin(adminLoginForm: NgForm): void {
    console.log(adminLoginForm.value)
    const { email, password } = adminLoginForm.value
    this.authService.login('/auth/admin/login', email, password)
    adminLoginForm.reset()
  }

  onPoliceLogin(policeLoginForm: NgForm): void {
    console.log(policeLoginForm.value)
    const { email, password } = policeLoginForm.value
    this.authService.login('/auth/police/login', email, password)
    policeLoginForm.reset()
  }

  onForgetPassword(): void {
    this.forgetPassword = true
  }
}
