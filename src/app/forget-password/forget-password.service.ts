import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { url } from '../constants'
import { AlertService } from '../ui/alert/alert.service'
import { LoadingService } from '../ui/loading/loading.service'

@Injectable({ providedIn: 'root' })
export class ForgetPasswordService {
  open = false
  isOpen = new Subject<boolean>()

  constructor(
    private http: HttpClient,
    private alert: AlertService,
    private loading: LoadingService
  ) {
    this.isOpen.next(this.open)
  }

  closeBox() {
    this.open = false
    this.isOpen.next(this.open)
  }

  openBox() {
    this.open = true
    this.isOpen.next(this.open)
  }

  send(email: string) {
    this.open = false
    this.isOpen.next(this.open)
    this.loading.setLoading(true)
    this.http.post(url + '/auth/reset-password', { email }).subscribe(
      (res: any) => {
        this.loading.setLoading(false)
        this.alert.setAlert('Success!', res.message)
      },
      (err) => {
        this.loading.setLoading(false)
        this.alert.setAlert('Error!', err.error.message)
        this.open = true
        this.isOpen.next(this.open)
      }
    )
  }
}
