import { HttpClient } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Subscription } from 'rxjs'
import { AlertService } from '../../ui/alert/alert.service'
import { LoadingService } from '../../ui/loading/loading.service'
import { url } from '../../constants'

interface Complaint {
  id: string
  status: string
  progress: 'PENDING' | 'IN-PROCESS' | 'REJECTED' | 'ACCEPTED' | 'RESOLVED'
  title: string
  type: string
  location: string
  timeOfCrime: string
  createdAt: string
}

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: [
    './complaints.component.css',
    '../../../assets/css/bootstrap5.min.css',
    '../../../assets/css/font-awesome.min.css',
  ],
})
export class ComplaintsComponent implements OnInit, OnDestroy {
  mode = 'pending'
  faCheckCircle = faCheckCircle
  faSpinner = faSpinner
  fragSub: Subscription
  pendingArray: Complaint[] = []
  resolvedArray: Complaint[] = []
  rejectedArray: Complaint[] = []
  activeArray: Complaint[] = []
  policeStation: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadingService.setLoading(true)
      this.http.get<{policeStation: string, complaints: Complaint[]}>(url + '/police/complaints').subscribe(
        (complaints) => {
          console.log(complaints)
          this.policeStation = complaints.policeStation
          this.loadingService.setLoading(false)
          this.pendingArray = complaints.complaints.filter(
            (it) => it.progress === 'PENDING'
          )
          this.resolvedArray = complaints.complaints.filter(
            (it) => it.progress === 'RESOLVED'
          )
          this.rejectedArray = complaints.complaints.filter(
            (it) => it.progress === 'REJECTED'
          )
          this.activeArray = complaints.complaints.filter(
            (it) => it.progress === 'ACCEPTED' || it.progress === 'IN-PROCESS'
          )
        },
        (err) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert('Error!', err.error.message)
        }
      )
    })
    this.fragSub = this.route.fragment.subscribe((fragment) => {
      if (!fragment) {
        this.mode = 'pending'
      } else if (
        fragment !== 'pending' &&
        fragment !== 'active' &&
        fragment !== 'resolved' &&
        fragment !== 'rejected'
      ) {
        this.mode = 'active'
      } else {
        this.mode = fragment
      }
    })
  }

  ngOnDestroy(): void {
    if (this.fragSub) {
      this.fragSub.unsubscribe()
    }
  }
}
