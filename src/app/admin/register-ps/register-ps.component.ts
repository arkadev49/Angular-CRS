import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { url } from 'src/app/constants'
import { AlertService } from 'src/app/ui/alert/alert.service'
import { LoadingService } from 'src/app/ui/loading/loading.service'

type PoliceStationList = {
  policeStation: string
  district: string
  division: string
  state: string
}[]

@Component({
  selector: 'app-register-ps',
  templateUrl: 'register-ps.component.html',
  styleUrls: [
    './register-ps.component.css',
    '../../../assets/css/bootstrap5.min.css',
    '../../../assets/css/font-awesome.min.css',
  ],
})
export class RegisterPSComponent implements OnInit {
  mode = 'policeStation'
  states = []
  districts = []
  divisions = []
  showArray: PoliceStationList = []
  tableLoaded = false

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private loading: LoadingService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.route.fragment.subscribe((fragment) => {
        if (!fragment) {
          this.mode = 'policeStation'
        } else if (
          fragment !== 'policeStation' &&
          fragment !== 'state' &&
          fragment !== 'district' &&
          fragment !== 'division' &&
          fragment !== 'show'
        ) {
          this.mode = 'state'
        } else {
          this.mode = fragment
        }

        if (this.mode !== 'state') {
          if (this.states.length === 0) {
            this.loading.setLoading(true)
            this.http.get(url + '/states').subscribe((states: any) => {
              this.states = states.states
              this.loading.setLoading(false)
            })
          }
        }

        if (this.mode === 'show') {
          this.loading.setLoading(true)
          this.http
            .get<PoliceStationList>(url + '/admin/police-stations')
            .subscribe(
              (res) => {
                this.loading.setLoading(false)
                console.log(res)
                this.showArray = res.sort((a, b) => {
                  if (a.state.localeCompare(b.state) !== 0) {
                    return a.state.localeCompare(b.state)
                  } else if (a.district.localeCompare(b.district) !== 0) {
                    return a.district.localeCompare(b.district)
                  } else if (a.division.localeCompare(b.division) !== 0) {
                    return a.division.localeCompare(b.division)
                  } else {
                    return a.policeStation.localeCompare(b.policeStation)
                  }
                })
                this.tableLoaded = true
              },
              (err) => {
                this.loading.setLoading(false)
                this.alert.setAlert('Error!', err.error.message)
              }
            )
        }
      })
    }, 0)
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return
    }
    console.log(form.value)
    this.loading.setLoading(true)
    this.http
      .post(url + '/admin/register/police-station', form.value)
      .subscribe(
        (res: any) => {
          this.loading.setLoading(false)
          this.alert.setAlert('Success!', res.message)
          form.reset()
        },
        (err) => {
          this.loading.setLoading(false)
          this.alert.setAlert('Error!', err.error.message)
          form.reset()
        }
      )
  }

  onDistrictChange(f: NgForm): void {
    this.divisions = []
    if (f.value.district === '') {
      return
    }
    this.loading.setLoading(true)
    this.http
      .get<{ state: string; district: string; divisions: string[] }>(
        url +
          '/divisions?state=' +
          f.value.state +
          '&district=' +
          f.value.district
      )
      .subscribe(
        (res) => {
          this.loading.setLoading(false)
          this.divisions = res.divisions
        },
        (err) => {
          this.loading.setLoading(false)
          this.alert.setAlert('Error!', err.error.message)
        }
      )
  }

  onStateChanged(f: NgForm): void {
    this.districts = []
    this.divisions = []
    if (f.value.state === '') {
      return
    }
    this.loading.setLoading(true)
    this.http
      .get<{ state: string; districts: string[] }>(
        url + '/districts?state=' + f.value.state
      )
      .subscribe(
        (res) => {
          this.loading.setLoading(false)
          this.districts = res.districts
        },
        (err) => {
          this.loading.setLoading(false)
          this.alert.setAlert('Error!', err.error.message)
        }
      )
  }
}
