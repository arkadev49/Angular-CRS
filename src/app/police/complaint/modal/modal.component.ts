import { Component, Input, OnInit } from '@angular/core'
import { ModalService } from './modal.service'
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css', '../../../../assets/css/w3.css'],
})
export class ModalComponent implements OnInit {
  @Input() accept: string
  @Input() modalTitle: string
  @Input() contentMinLength: number
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  onReject(form: NgForm): void {
    this.modalService.onModalAccept(form.value.message)
  }

  onCancel(): void {
    this.modalService.setModalOpen(false)
  }
}
