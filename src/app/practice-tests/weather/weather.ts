import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import { WeatherService } from '../../core/services/weather-service';

@Component({
  selector: 'app-weather',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class Weather implements OnInit {
  cityControl = new FormControl('Bengaluru');
  currentWeather = signal<any | null>(null);
  forecast = signal<{ day: string, temp: number, icon: string }[]>([]);
  loading = signal(false);
  error = signal(false);

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.cityControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(city => {
        this.loading.set(true);
        this.error.set(false);
        return this.weatherService.getCurrentWeather(city || 'Bengaluru');
      })
    ).subscribe(data => {
      if (data.error) {
        this.error.set(true);
        this.loading.set(false);
      } else {
        this.currentWeather.set(data);
        this.loadForecast(this.cityControl.value || 'Bengaluru');
      }
    });

    // Default load
    this.loadWeather('Bengaluru');
  }

  loadWeather(city: string) {
    this.loading.set(true);
    this.weatherService.getCurrentWeather(city).subscribe(data => {
      if (data.error) {
        this.error.set(true);
        this.loading.set(false);
      } else {
        this.currentWeather.set(data);
        this.loadForecast(city);
      }
    });
  }

  loadForecast(city: string) {
    this.weatherService.getForecast(city).subscribe(data => {
      if (data.error) {
        this.error.set(true);
        this.loading.set(false);
      } else {
        const dailyData: { [key: string]: { temps: number[], icons: string[] } } = {};
        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!dailyData[date]) dailyData[date] = { temps: [], icons: [] };
          dailyData[date].temps.push(item.main.temp);
          dailyData[date].icons.push(item.weather[0].icon);
        });

        this.forecast.set(
          Object.keys(dailyData).slice(0, 7).map(day => {
            const temps = dailyData[day].temps;
            const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
            const icon = dailyData[day].icons[0];
            return { day, temp: avgTemp, icon };
          })
        );

        this.loading.set(false);
      }
    });
  }

  retry() {
    this.error.set(false);
    this.loadWeather(this.cityControl.value || 'Bengaluru');
  }
}
