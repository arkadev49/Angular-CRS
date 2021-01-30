import { Component, Input, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { ForgetPasswordService } from './forget-password.service'

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  constructor(private forgetService: ForgetPasswordService) {}

  ngOnInit(): void {}

  onClose(): void {
    this.forgetService.closeBox()
  }

  onSend(f: NgForm): void {
    this.forgetService.send(f.value.email)
  }
}
