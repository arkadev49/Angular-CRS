import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { url } from '../../constants'
import { LoadingService } from '../../ui/loading/loading.service'
import { NgForm } from '@angular/forms'
import { AlertService } from '../../ui/alert/alert.service'

@Component({
  selector: 'app-police-register',
  templateUrl: './police-register.component.html',
  styleUrls: [
    './police-register.component.css',
    '../../../assets/css/main.css',
    '../../../assets/css/bootstrap.min.css',
  ],
})
export class PoliceRegisterComponent implements OnInit {
  states: string[] = []
  districts: string[] = []
  divisions: string[] = []
  policeStations: string[] = []

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadingService.setLoading(true)
      this.http.get(url + '/states').subscribe(
        (res: any) => {
          console.log(res)
          this.states = res.states
          this.loadingService.setLoading(false)
        },
        (err) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert(
            'Error fetching States',
            'Try Again Later!'
          )
        }
      )
    }, 0)
  }

  onStateChanged(f: NgForm): void {
    if (f.value.state === '') {
      this.districts = []
      this.divisions = []
      this.policeStations = []
      return
    }
    this.loadingService.setLoading(true)
    this.http.get(url + '/districts?state=' + f.value.state).subscribe(
      (res: any) => {
        console.log(res)
        this.districts = res.districts
        this.loadingService.setLoading(false)
      },
      (err) => {
        this.loadingService.setLoading(false)
        this.alertService.setAlert(
          'Error fetching Districts',
          'Try Again Later!'
        )
      }
    )
  }

  onDistrictChanged(f: NgForm): void {
    if (f.value.district === '') {
      this.divisions = []
      this.policeStations = []
      return
    }
    this.loadingService.setLoading(true)
    this.http
      .get(
        url +
          '/divisions?district=' +
          f.value.district +
          '&state=' +
          f.value.state
      )
      .subscribe(
        (res: any) => {
          console.log(res)
          this.divisions = res.divisions
          this.loadingService.setLoading(false)
        },
        (err) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert(
            'Error fetching Divisions',
            'Try Again Later!'
          )
        }
      )
  }

  onSubmit(f: NgForm): void {
    const { password, confPassword } = f.value
    if (password !== confPassword) {
      this.alertService.setAlert(
        'Password mismatch!',
        "The Password and Confirm Password Fields Didn't match. Try Again!"
      )
      return
    }
    const formData = { ...f.value }
    delete formData.confPassword

    this.loadingService.setLoading(true)

    this.http.post(url + '/auth/police/register', formData).subscribe(
      (res: any) => {
        this.loadingService.setLoading(false)
        this.alertService.setAlert('Success!', res.message)
        f.reset()
      },
      (err) => {
        this.loadingService.setLoading(false)
        this.alertService.setAlert('Error!', err.error.message)
      }
    )
  }

  onDivisionChanged(f: NgForm): void {
    if (f.value.division === '') {
      this.policeStations = []
      return
    }
    this.loadingService.setLoading(true)
    this.http
      .get(
        url +
          '/police-stations?district=' +
          f.value.district +
          '&state=' +
          f.value.state +
          '&division=' +
          f.value.division
      )
      .subscribe(
        (res: any) => {
          console.log(res)
          this.policeStations = res.policeStations
          this.loadingService.setLoading(false)
        },
        (err) => {
          this.loadingService.setLoading(false)
          this.alertService.setAlert(
            'Error fetching Police Stations',
            'Try Again Later!'
          )
        }
      )
  }
}
