import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '358a7cbe7380f0bdaeef008aebb8bf94';
  private weatherApi = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastApi = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<any> {
    return this.http.get(`${this.weatherApi}?q=${city}&units=metric&appid=${this.apiKey}`)
      .pipe(
        catchError(err => of({ error: true, message: err.message }))
      );
  }

  getForecast(city: string): Observable<any> {
    return this.http.get(`${this.forecastApi}?q=${city}&units=metric&cnt=32&appid=${this.apiKey}`)
      .pipe(
        catchError(err => of({ error: true, message: err.message }))
      );
  }

}
