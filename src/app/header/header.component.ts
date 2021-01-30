import { Component, OnInit } from '@angular/core'
import { AuthService } from '../auth/auth.service'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: 'POLICE' | 'ADMIN' | 'CITIZEN'

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user.role
      } else {
        this.user = null
      }
    })
  }

  onLogout(): void {
    this.authService.logout()
  }
}
