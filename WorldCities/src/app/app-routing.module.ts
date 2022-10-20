import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login.component';
import { CitiesComponent } from './cities/cities.component';
import { CityEditComponent } from './cities/city-edit.component';
import { CountriesComponent } from './countries/countries.component';
import { CountryEditComponent } from './countries/country-edit.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'cities', component: CitiesComponent},
  {path: 'city/:id', component: CityEditComponent, canActivate: [AuthGuard]},
  {path: 'city', component: CityEditComponent, canActivate: [AuthGuard]},
  {path: 'countries', component: CountriesComponent},
  {path: 'country/:id', component: CountryEditComponent, canActivate: [AuthGuard]},
  {path: 'country', component: CountryEditComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
