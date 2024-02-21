import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constantvalues } from '../app.constant';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    baseUrl :string = "http://localhost:3000";
    constructor(private hc : HttpClient){

    }
    getOpertationData(action : string) : any{
       return this.hc.get(`${this.baseUrl}${constantvalues.API_URL.GET_ALERT_DETAILS}?action=${action}`);
    }
}