import { Component, OnInit } from '@angular/core'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../assets/css/bootstrap5.min.css', './home.component.css'],
})
export class HomeComponent implements OnInit {
  auth: boolean
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      if (user) this.auth = true
      else this.auth = false
    })
  }

  onLogout(): void {
    this.authService.logout()
  }
}
