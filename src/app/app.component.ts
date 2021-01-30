import { Component, OnDestroy, OnInit } from '@angular/core'
import { LoadingService } from './ui/loading/loading.service'
import { Subscription } from 'rxjs'
import { AlertService } from './ui/alert/alert.service'
import { AuthService } from './auth/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean
  loadingSub: Subscription
  alertSub: Subscription
  alertMessage: string
  alertTitle: string
  alert: boolean
  showSub: Subscription

  constructor(
    private loadingService: LoadingService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin()
    this.loadingSub = this.loadingService.loadingChanged.subscribe((status) => {
      console.log('Loading...', status)
      this.loading = status
    })
    this.alertSub = this.alertService.alertChanged.subscribe((alert) => {
      this.alertMessage = alert.message
      this.alertTitle = alert.title
      this.alert = true
    })
    this.showSub = this.alertService.showChanged.subscribe((res) => {
      this.alert = res
    })
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe()
    this.alertSub.unsubscribe()
    this.showSub.unsubscribe()
  }
}
