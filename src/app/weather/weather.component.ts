import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
// import { MaterialModule } from "../shared/material.module";

import { WeatherserviceService } from './weatherservice.service';
import { ForecastData } from '../models/ForecastData.model';
import { ForecastDetails } from '../models/ForecastDetails.model';
import { NgModel } from '@angular/forms';
import { from } from 'rxjs';



@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  weathers: any[] = [];
  weatherdata: any|undefined;
  wetherType: any|undefined;
  lon: any;
  lat:any;
  currentTime = new Date()
  airinfo: any;
  maxtemp:any|undefined
  winddeg: any;
  windhum: any;
  pres: any;
  speed: any;
  forecastData : any | undefined;
  mtemp: any;
  fmain:any;
  showhourly:boolean=true
  showdaily:boolean=false
  city:string='';
  


  constructor(private http: HttpClient,private weatherservice:WeatherserviceService ) {
  }
  getcity(city: string) {
    // alert(city)
    this.city=city
    console.log(this.city)
    this.getweatherdata(city,'','')
    // this.weatherservice.LoadForecastWeather(city,'','');
    this.loadForecastWeather()
  }

  ngOnInit() {
    // this.getweatherdata('thane','','');
    // this.getWeather()
    navigator.geolocation.getCurrentPosition((position)=>{
      console.log("current pos",position.coords)
      this.lon = position.coords.longitude
      this.lat = position.coords.latitude

      this.getweatherdata('',this.lat,this.lon)
      this.getairinfo(this.lat,this.lon);
      // this.weatherservice.LoadForecastWeather('',this.lat,this.lon)
      this.loadForecastWeather()
      this.weatherservice.city=this.city
    })
    
  }

  getweatherdata(city:string, lat: any, lon: any) {
    // console.log(lat,lon)
    this.http.get('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&lat='+lat+'&lon='+lon+'&appid=e1e124328a7b05df3d02c4b9f86db340').subscribe(
      (res) => {
        // console.log(res)
        this.setweatherdata(res)
      },
      (err) => {
        console.log(err)
      }
    )
    // fetch('https://api.openweathermap.org/data/2.5/forecast?q=mumbai&appid=e1e124328a7b05df3d02c4b9f86db340')
    //   .then(res => res.json())
    //   .then(data => { this.setweatherdata(data); })
    // let data = JSON.parse('{"location":{"name":"New Delhi","region":"Delhi","country":"India","lat":28.6,"lon":77.2,"tz_id":"Asia/Kolkata","localtime_epoch":1693977189,"localtime":"2023-09-06 10:43"},"current":{"last_updated_epoch":1693976400,"last_updated":"2023-09-06 10:30","temp_c":30.0,"temp_f":86.0,"is_day":1,"condition":{"text":"Mist","icon":"//cdn.weatherapi.com/weather/64x64/day/143.png","code":1030},"wind_mph":4.3,"wind_kph":6.8,"wind_degree":110,"wind_dir":"ESE","pressure_mb":1008.0,"pressure_in":29.77,"precip_mm":0.1,"precip_in":0.0,"humidity":66,"cloud":50,"feelslike_c":31.3,"feelslike_f":88.4,"vis_km":5.0,"vis_miles":3.0,"uv":7.0,"gust_mph":7.2,"gust_kph":11.5}}')
    // this.setweatherdata(data);
  }

  getairinfo(lat: any, lon: any){
    this.http.get('http://api.openweathermap.org/data/2.5/air_pollution?lat='+lat+'&lon='+lon+'&appid=e1e124328a7b05df3d02c4b9f86db340').subscribe(
      (res)=>{
        // console.log(res)
        this.setairinfo(res)
    },
    (err)=>{
      console.log(err)
    }
    )
  }

  setairinfo(data:any){
    this.airinfo=data.list[0].main.aqi
    console.log(this.airinfo)
  }

  

  setweatherdata(data: any) {
    this.weatherdata = data.list;
    // console.log(this.weatherdata)
    this.wetherType = this.weatherdata.map((e: any) => e.weather[0])
    // console.log('wetherType', this.wetherType)
    let currentDate = new Date()
    this.weatherdata.currentDate = currentDate.toLocaleDateString();
    // let currentTime = new Date()
    // this.weatherdata.currentTime = currentTime.toLocaleTimeString();
    // // this.weatherdata = currentDate
    // // console.log(currentDate)
    // let sunset =new Date(data.sys.sunset*1000);
    // this.weatherdata.sunset = sunset.toLocaleTimeString();
    // // console.log(sunrise);
    // this.weatherdata.temp = (data.main.temp).toFixed(0)
    
    // this.weatherdata.mintemp = (data.main.temp_min).toFixed(0)
    // this.weatherdata.wind = (data.wind.speed).toFixed(0)
    // this.weatherdata.wind_deg = data.wind.deg
    // alert(this.weatherdata.currentTime)
    // console.log(maxtemp)
    // console.log(mintemp)
    // console.log(wind)
    // console.log(wind_deg)
    this.maxtemp = (this.weatherdata[0].main.temp_max.toFixed(0)-273)
    // console.log(this.maxtemp)
    this.winddeg =(this.weatherdata[0].wind.deg)
    // console.log(this.winddeg)
    this.windhum=(this.weatherdata[0].main.humidity)
    // console.log(this.windhum)
    this.pres = (this.weatherdata[0].main.pressure)
    // console.log("Pressure",this.pres)
    this.speed =(this.weatherdata[0].wind.speed)
    // console.log(this.speed)



  }
  loadForecastWeather() {
    this.weatherservice.LoadForecastWeather(this.city,this.lat,this.lon).subscribe(
   res => {
            this.forecastData = new ForecastData()
            this.forecastData.name = res.city.name;//Instance to store the Data of ForecastModel
            // console.log(res)
        for(var i=7; i<res.list.length;i=i+8)//Since we want for 5 days. it Jumps 8 times to get to next day.(A day had 8 details in API.)
        {
          //Instance of type ForecastDetails and stores the data in it.
          var details = new ForecastDetails();
          details.date = res.list[i].dt_txt;
          details.maxTemperature = res.list[i].main.temp_max;
          details.minTemperature = res.list[i].main.temp_min;
          details.description = res.list[i].weather[0].description;
          details.main = res.list[i].weather[0].main;
          details.icon = res.list[i].weather[0].icon;
          this.forecastData.details.push(details);//Pushing the data to the to created object

         }
   }
 )
}

forecasthourly(){
this.showhourly=true;
this.showdaily=false;
}
forcastdaily(){
  this.showhourly=false
  this.showdaily=true
}
isChecked = false
checkValue(event: any){
  // console.log(event);

}


}






