import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { url } from '../../constants'
import { AlertService } from '../../ui/alert/alert.service'
import { NgForm } from '@angular/forms'
import { LoadingService } from 'src/app/ui/loading/loading.service'
import { ComplaintService } from '../complaint/complaint.service'

@Component({
  selector: 'app-resolve-complaint',
  templateUrl: './resolve-complaint.component.html',
  styleUrls: ['./resolve-complaint.component.css'],
})
export class ResolveComplaintComponent implements OnInit {
  complaintId: string
  selectedFile: File
  states: string[]
  districts: string[]

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private alert: AlertService,
    private router: Router,
    private loading: LoadingService,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.complaintId = params.id
    })
    setTimeout(() => {
      this.loading.setLoading(true)
      this.http.get(url + '/police/complaint/' + this.complaintId).subscribe(
        (complaint: any) => {
          this.loading.setLoading(false)
          this.complaintId = complaint._id
        },
        (err) => {
          this.loading.setLoading(false)
          this.alert.setAlert('Error!', err.error.message)
          this.router.navigate(['/police/complaints'])
        }
      )
      this.loading.setLoading(true)
      this.http.get(url + '/states').subscribe(
        (resStates: any) => {
          this.loading.setLoading(false)
          this.states = resStates.states
        },
        (err) => {
          this.loading.setLoading(false)
          this.alert.setAlert('Error!', 'Cannot Fetch States!')
        }
      )
    }, 0)
  }

  onFileSelected(event): void {
    this.selectedFile = event.target.files[0] as File
  }

  onStateChanged(f: NgForm): void {
    this.loading.setLoading(true)
    this.http.get(url + '/districts?state=' + f.value.state).subscribe(
      (resDistricts: any) => {
        this.loading.setLoading(false)
        this.districts = resDistricts.districts
      },
      (err) => {
        this.loading.setLoading(false)
        this.alert.setAlert('Error!', 'Cannot Fetch Districts!')
      }
    )
  }

  onSubmit(f: NgForm): void {
    console.log(f)
    if (f.invalid) {
      return
    }
    const formData = new FormData()
    formData.append('image', this.selectedFile, this.selectedFile.name)
    formData.append('criminalName', f.value.criminalName)
    formData.append('state', f.value.state)
    formData.append('district', f.value.district)
    formData.append('criminalAddress', f.value.criminalAddress)
    formData.append('criminalDetails', f.value.criminalDetails)
    formData.append('description', f.value.description)
    this.complaintService.postResolveComplaint(
      this.route.snapshot.params.id,
      formData
    )
  }
}
