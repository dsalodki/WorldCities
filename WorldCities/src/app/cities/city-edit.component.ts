import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BaseFormComponent } from '../base-form.component';
import { Country } from '../countries/country';
import { City } from './city';
import { CityService } from './city.service';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {
  title?: string;
  city?: City;
  // the city object id, as fetched from the active route:
  // It's NULL when we're adding a new city,
  // and not NULL when we're editting an existing one.
  id?: number;
  countries?: Country[];

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cityService: CityService) {
      super();
    }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      lat: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
        ]),
      lon: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
        ]),
      countryId: new UntypedFormControl('', Validators.required)
    }, null, this.isDupeCity());

    this.loadData();
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any} | null> => {
      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = this.form.controls['lat'].value;
      city.lon = this.form.controls['lon'].value;
      city.countryId = this.form.controls['countryId'].value;

      
      return this.cityService.isDupeCity(city).pipe(map(result => {
        return (result ? { isDupeCity: true } : null);
      }))
    }
  }

  loadData() {
    this.loadCountries();

    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    if(this.id){
      // EDIT mode
      this.cityService.get(this.id).subscribe(result => {
        this.city = result;
        this.title = "Edit - " + this.city.name;
  
        this.form.patchValue(this.city);
      }, error => console.error(error));
    } else {
      // ADD NEW mode
      this.title = "Create a new city"
    }

  }
  loadCountries()
  {
    this.cityService.getCountries(0, 2147483647, "name", "asc", null, null)
      .subscribe(result => {
        this.countries = result.data;
      }, error => console.error(error));
  }

  onSubmit() {
    var city = (this.id) ? this.city : <City>{};
    if(city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      if(this.id){
      // EDIT mode
      this.cityService.put(city).subscribe(result => {
        console.log("City " + city!.id + " has been updated.");

        // go back to cities view
        this.router.navigate(['/cities']);
      }, error => console.error(error));
    }else{
      // ADD NEW mode
      this.cityService.post(city).subscribe(result => {
        console.log("City " + result.id + " has been created");

        this.router.navigate(['/cities']);
      }, error => console.error(error));
    }
    }
  }
}
