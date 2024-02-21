import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    LocationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GoogleMapsModule,
    LocationRoutingModule
  ]
})
export class LocationModule { }
