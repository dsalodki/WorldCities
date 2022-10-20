import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseFormComponent } from '../base-form.component';
import { Country } from './country';
import { CountryService } from './country.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.scss']
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {
  title?: string;
  country?: Country;
  id?: number;
  countries?: Country[];

  constructor(
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private countryService: CountryService) {
    super();
   }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required,
      this.isDupeField("name")
    ],
      iso2: ['', 
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{2}$/)
        ],
      this.isDupeField("iso2")
    ],
      iso3: ['', 
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]{3}$/)
      ],
      this.isDupeField("iso3")
    ]
  });

  this.loadData();
  }

  loadData()
  {
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if(this.id) {
      // edit mode

      // fetch country from the server
      this.countryService.get(this.id).subscribe(result => {
        this.country = result;
        this.title = "Edit - " + this.country.name;

        this.form.patchValue(this.country);
      }, error => console.error(error));
    } else{
      // add new mode
      this.title = "Create a new country";
    }
  }

  onSubmit() {
    var country = (this.id) ? this.country : <Country>{};
    if(country) {
      country.name = this.form.controls['name'].value;
      country.iso2 = this.form.controls['iso2'].value;
      country.iso3 = this.form.controls['iso3'].value;

      if(this.id) {
        // edit mode
        this.countryService.put(country).subscribe(result => {
          console.log("Country " + country!.id + " has been updated.");
          this.router.navigate(['/countries']);
        }, error => console.error(error));
      }else{
        // add new mode
        this.countryService.post(country).subscribe(result => {
          console.log("Country " + result.id + " has been created.");
          this.router.navigate(['/countries']);
        }, error => console.error(error));
      }
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null>=> {
      return this.countryService.isDupeField(
          this.id??0,
          fieldName,
          control.value
        ).pipe(map(result => {
        return (result ? { isDupeField: true } : null);
      }));
    }
  }

}
