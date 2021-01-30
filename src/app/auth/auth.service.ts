import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { url } from '../constants'
import { User } from '../../models/user.model'
import { LoadingService } from '../ui/loading/loading.service'
import { AlertService } from '../ui/alert/alert.service'
import { BehaviorSubject } from 'rxjs'
import { Router } from '@angular/router'

interface UserResponse {
  id: string
  name: string
  email: string
  token: string
  role: 'ADMIN' | 'POLICE' | 'CITIZEN'
  image: string
  loginTime?: Date
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  loginTime = 3600000
  user = new BehaviorSubject<User>(null)
  timer: any

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private router: Router
  ) {}

  autoLogin(): void {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const parsedData: UserResponse = JSON.parse(userData)
      if (
        new Date().getTime() - new Date(parsedData.loginTime).getTime() >
        this.loginTime
      ) {
        localStorage.removeItem('userData')
        return
      } else {
        this.timer = setTimeout(() => {
          this.logout()
          this.alertService.setAlert(
            'Session Time Out',
            'Please Log In Again to Continue!'
          )
        }, this.loginTime - (new Date().getTime() - new Date(parsedData.loginTime).getTime()))
      }
      console.log(
        this.loginTime -
          (new Date().getTime() - new Date(parsedData.loginTime).getTime())
      )
      const user = new User(
        parsedData.id,
        parsedData.name,
        parsedData.email,
        parsedData.token,
        parsedData.role,
        parsedData.image
      )
      this.user.next(user)
    }
  }

  login(path: string, email: string, password: string): void {
    this.loadingService.setLoading(true)
    this.http
      .post(url + path, {
        email,
        password,
      })
      .subscribe(
        (resUser: UserResponse) => {
          this.alertService.setAlert(
            'Success!',
            (path === '/auth/admin/login' ? 'ADMIN' : 'POLICE') +
              ' LOGIN SUCCESSFUL!'
          )
          this.loadingService.setLoading(false)
          const user = new User(
            resUser.id,
            resUser.name,
            resUser.email,
            resUser.token,
            resUser.role,
            resUser.image
          )
          const modifiedUser = { ...resUser, loginTime: new Date() }
          localStorage.setItem('userData', JSON.stringify(modifiedUser))
          this.user.next(user)
          if (user.role === 'POLICE') {
            this.router.navigate(['/police/complaints']).then(() => {})
          } else if (user.role === 'ADMIN') {
            this.router.navigate(['/admin/register-ps']).then(() => {})
          }
          this.timer = setTimeout(() => {
            this.alertService.setAlert(
              'Session Time Out',
              'Please Log In Again to Continue!'
            )
            this.logout()
          }, this.loginTime)
          console.log(user)
        },
        (err) => {
          console.log(err)
          this.loadingService.setLoading(false)
          this.alertService.setAlert('Error!', err.error.message)
        }
      )
  }

  logout(): void {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.http.post(url + '/auth/logout', {}).subscribe(() => {})
    this.user.next(null)
    this.router.navigate(['/']).then(() => {})
    localStorage.removeItem('userData')
  }

  resetPassword(token: string, email: string, password: string): void {
    console.log(token, email, password)
    this.loadingService.setLoading(true)
    this.http
      .put(url + '/auth/reset-password', { email, password, token })
      .subscribe(
        (res: any) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert('Success!', res.message, () => {
            window.close()
          })
        },
        (err) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert('Error!', err.error.message)
        }
      )
  }
}
