import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import { WeatherService } from '../../core/services/weather-service';
@Component({
  selector: 'app-weather',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class Weather {
 cityControl = new FormControl('Bengaluru');
  currentWeather: any;
  forecast: { day: string, temp: number, icon: string }[] = [];
  loading = false;
  error = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    // Search with debounce
    this.cityControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(city => {
        this.loading = true;
        this.error = false;
        return this.weatherService.getCurrentWeather(city||"Bengaluru");
      })
    ).subscribe(data => {
      if (data.error) {
        this.error = true;
        this.loading = false;
      } else {
        this.currentWeather = data;
        this.loadForecast(this.cityControl.value||"Bengaluru");
      }
    });

    // Default load
    this.loadWeather('Bengaluru');
  }

  loadWeather(city: string) {
    this.loading = true;
    this.weatherService.getCurrentWeather(city).subscribe(data => {
      if (data.error) {
        this.error = true;
        this.loading = false;
      } else {
        this.currentWeather = data;
        this.loadForecast(city);
      }
    });
  }

  loadForecast(city: string) {
    this.weatherService.getForecast(city).subscribe(data => {
      if (data.error) {
        this.error = true;
        this.loading = false;
      } else {
        const dailyData: { [key: string]: { temps: number[], icons: string[] } } = {};

        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!dailyData[date]) dailyData[date] = { temps: [], icons: [] };
          dailyData[date].temps.push(item.main.temp);
          dailyData[date].icons.push(item.weather[0].icon);
        });

        this.forecast = Object.keys(dailyData).slice(0, 7).map(day => {
          const temps = dailyData[day].temps;
          const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
          const icon = dailyData[day].icons[0]; // Use first icon of the day
          return { day, temp: avgTemp, icon };
        });

        this.loading = false;
      }
    });
  }

  retry() {
    this.error = false;
    this.loadWeather(this.cityControl.value || "Bengaluru");
  }
}
