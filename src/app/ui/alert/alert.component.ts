import { Component, Input, OnInit } from '@angular/core'
import { AlertService } from './alert.service'

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  @Input() alertMessage: string
  @Input() alertTitle: string

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {}

  onClose(): void {
    this.alertService.closeAlert()
  }
}
