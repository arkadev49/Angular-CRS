import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { AlertService } from '../../ui/alert/alert.service'
import { AuthService } from '../auth.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private alert: AlertService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm): void {
    if (f.valid) {
      if (f.value.password !== f.value.confirmPassword) {
        this.alert.setAlert(
          'Error!',
          "Password and Confirm Password Did'nt Match"
        )
      } else {
        console.log(f.value)
        this.authService.resetPassword(
          this.route.snapshot.queryParams.token,
          f.value.email,
          f.value.password
        )
      }
    } else {
      this.alert.setAlert(
        'Error!',
        'Form Fields are Still Invalid. Please correct necessary changes!'
      )
    }
  }
}
