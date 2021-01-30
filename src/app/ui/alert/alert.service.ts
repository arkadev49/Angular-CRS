import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  alertChanged = new Subject<{ message: string; title: string }>()
  showChanged = new Subject<boolean>()
  alert = false
  onClose: () => void

  constructor() {}

  setAlert(title: string, message: string, onClose?: () => void): void {
    this.alertChanged.next({ title, message })
    this.alert = true
    this.showChanged.next(this.alert)
    if (onClose) {
      this.onClose = onClose
    }
  }

  closeAlert(): void {
    this.alert = false
    this.showChanged.next(this.alert)
    if (this.onClose) {
      this.onClose()
    }
  }
}
