import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ModalService {
  open = false
  accept = false
  changed = new Subject<boolean>()
  accepted = new Subject<string>()

  setModalOpen(status: boolean): void {
    this.open = status
    this.changed.next(this.open)
  }

  onModalAccept(msg: string): void {
    this.accept = true
    this.accepted.next(msg)
    this.setModalOpen(false)
  }
}
