import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading = false
  loadingChanged = new Subject<boolean>()

  constructor() {}

  setLoading(loading: boolean): void {
    this.loading = loading
    this.loadingChanged.next(this.loading)
  }
}
