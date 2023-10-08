import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
// import {WeatherComponent} from './weather.component'

@Injectable({
  providedIn: 'root'
})
export class WeatherserviceService implements OnInit {

  appid = 'e1e124328a7b05df3d02c4b9f86db340';
  weatherCatalog: any;
  getData: any;
  lon:any;
  lat:any;
  city: string='';



  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position)=>{
      console.log("current pos",position.coords)
      this.lon = position.coords.longitude
      this.lat = position.coords.latitude
      this.LoadForecastWeather(this.city,this.lat,this.lon)
      
    })
    
  }
  LoadForecastWeather(city:any,lat:any,lon:any): Observable<any> {
    return this.http.get('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&lat='+lat+'&lon='+lon+'&appid=e1e124328a7b05df3d02c4b9f86db340' );
  }
  

  }



