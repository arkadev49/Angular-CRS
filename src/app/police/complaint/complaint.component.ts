import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { ComplaintService } from './complaint.service'

import { Complaint } from './complaint.service'
import { ModalService } from './modal/modal.service'

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: [
    './complaint.component.css',
    '../../../assets/css/bootstrap4.min.css',
  ],
})
export class ComplaintComponent implements OnInit, OnDestroy {
  complaint: Complaint
  modalOpen = false
  mode: 'UPDATE' | 'REJECT'
  complaintSub: Subscription
  modalSub: Subscription
  acceptModalSub: Subscription

  constructor(
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private modalService: ModalService
  ) {}

  id: string
  btnAcceptText: string
  modalTitle: string
  contentMinLength: number

  ngOnInit(): void {
    setTimeout(() => {
      this.route.params.subscribe((params) => {
        this.id = params.id
        this.complaintService.getComplaintById(this.id)
      })
    }, 0)
    this.complaintSub = this.complaintService.complaintChanged.subscribe(
      (complaint) => {
        this.complaint = complaint
      }
    )
    this.modalSub = this.modalService.changed.subscribe((status: boolean) => {
      this.modalOpen = status
    })
    this.acceptModalSub = this.modalService.accepted.subscribe(
      (msg: string) => {
        if (this.mode === 'REJECT') {
          if (
            window.confirm('Are You Sure You Want to Reject this Complaint ?')
          ) {
            this.complaintService.patchRejectComplaint(this.id, msg)
          }
        } else {
          this.complaintService.putUpdateComplaint(this.id, msg)
        }
      }
    )
  }

  onAccept(): void {
    if (window.confirm('Are You Sure You Want to Accept this Case ?')) {
      this.complaintService.postAcceptComplaint(this.id)
    }
  }

  onReject(): void {
    this.mode = 'REJECT'
    this.contentMinLength = 20
    this.btnAcceptText = 'Reject'
    this.modalTitle = 'BRIEF YOUR REASON FOR REJECTION'
    this.modalService.setModalOpen(true)
  }

  onUpdate(): void {
    this.mode = 'UPDATE'
    this.contentMinLength = 10
    this.btnAcceptText = 'Update'
    this.modalTitle = 'CHANGE STATUS'
    this.modalService.setModalOpen(true)
  }

  ngOnDestroy(): void {
    this.acceptModalSub.unsubscribe()
    this.modalSub.unsubscribe()
    this.complaintSub.unsubscribe()
  }
}
