import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { url } from 'src/app/constants'
import { AlertService } from '../../ui/alert/alert.service'
import { LoadingService } from '../../ui/loading/loading.service'

export interface Complaint {
  status: string
  progress:
    | 'PENDING'
    | 'ON-HOLD'
    | 'IN-PROCESS'
    | 'REJECTED'
    | 'ACCEPTED'
    | 'RESOLVED'
  _id: string
  title: string
  type: string
  location: string
  timeOfCrime: string
  description: string
  user: {
    role: string
    _id: string
    name: string
    email: string
    image: string
    address: string
    pincode: number
    policeStation: {
      name: string
    }
    division: {
      name: string
    }
    district: {
      name: string
    }
    state: {
      name: string
    }
  }
  policeStation: string
  createdAt: string
  updatedAt: string
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  complaint: Complaint
  complaintChanged = new Subject<Complaint>()

  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService,
    private http: HttpClient,
    private router: Router
  ) {}

  getComplaintById(id: string): void {
    this.loadingService.setLoading(true)
    this.http.get<Complaint>(url + '/police/complaint/' + id).subscribe(
      (complaint) => {
        console.log(complaint)
        this.complaint = complaint
        this.complaintChanged.next(this.complaint)
        this.loadingService.setLoading(false)
      },
      (err) => {
        this.loadingService.setLoading(false)
        this.alertService.setAlert('Error!', err.error.message)
        this.router.navigate(['/police/complaints'])
      }
    )
  }

  postAcceptComplaint(id: string): void {
    this.loadingService.setLoading(true)
    this.http.post<Complaint>(url + '/police/complaint/' + id, {}).subscribe(
      (resComplaint) => {
        this.loadingService.setLoading(false)
        this.complaint = resComplaint
        this.complaintChanged.next(this.complaint)
      },
      (err) => {
        this.loadingService.setLoading(false)
        this.alertService.setAlert('Error!', err.error.message)
      }
    )
  }

  patchRejectComplaint(id: string, reason: string): void {
    this.loadingService.setLoading(true)
    this.http
      .patch<Complaint>(url + '/police/complaint/' + id, {
        reason,
      })
      .subscribe(
        (resComplaint) => {
          this.loadingService.setLoading(false)
          this.complaint = resComplaint
          this.complaintChanged.next(this.complaint)
          this.router.navigate(['/police/complaints'])
          this.alertService.setAlert(
            'Warning!',
            'The Complaint was Rejected by you!'
          )
        },
        (err) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert('Error!', err.error.message)
        }
      )
  }

  putUpdateComplaint(id: string, status: string): void {
    if (!window.confirm('Are You Sure You Want to Update Status ?')) {
      return
    }
    this.loadingService.setLoading(true)
    this.http
      .put<Complaint>(url + '/police/complaint/' + id, {
        status,
      })
      .subscribe(
        (resComplaint) => {
          this.loadingService.setLoading(false)
          this.complaint = resComplaint
          this.complaintChanged.next(this.complaint)
          this.alertService.setAlert(
            'Success!',
            `The Complaint Status was Updated!`
          )
        },
        (err) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert(
            'Error!',
            `Updating Status Unsuccessful - ${err.error.message}`
          )
        }
      )
  }

  postResolveComplaint(id: string, formData: FormData): void {
    this.loadingService.setLoading(true)
    this.http
      .post<Complaint>(url + '/police/complaint/' + id + '/resolve', formData, {
        headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
      })
      .subscribe(
        (resComplaint) => {
          this.loadingService.setLoading(false)
          this.complaint = resComplaint
          this.complaintChanged.next(this.complaint)
          this.alertService.setAlert(
            'Success!',
            'The Complaint was Successfully Resolved'
          )
          this.router.navigate(['/police/complaints/' + id]).then(() => {})
        },
        (err) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert(
            'Error!',
            `Complaint Did not Resolve : ${err.error.message}`
          )
        }
      )
  }
}
