import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private http: HttpClient) {}
   apiKey= "pk.f9724773ff3ab01d97fa6bbd4dbb625f"

  searchCity(city: string): Observable<{ lat: number; lon: number } | null> {
     const url = `https://us1.locationiq.com/v1/search?key=${this.apiKey}&q=${encodeURIComponent(city)}&format=json`;
    return this.http.get<any[]>(url).pipe(
      map(res => res.length ? { lat: +res[0].lat, lon: +res[0].lon } : null)
    );
  }

  getRoute(from: [number, number], to: [number, number]): Observable<any> {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    return this.http.get<any>(url);
  }
}
