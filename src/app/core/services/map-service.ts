import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private http: HttpClient) {}

  searchCity(city: string): Observable<{ lat: number; lon: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
    return this.http.get<any[]>(url).pipe(
      map(res => res.length ? { lat: +res[0].lat, lon: +res[0].lon } : null)
    );
  }

  getRoute(from: [number, number], to: [number, number]): Observable<any> {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    return this.http.get<any>(url);
  }
}
