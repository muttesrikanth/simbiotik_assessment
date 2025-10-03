import { Component, AfterViewInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../core/services/map-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-maps',
  imports: [FormsModule, CommonModule],
  templateUrl: './maps.html',
  styleUrl: './maps.css'
})
export class Maps {
  fromCity = '';
  toCity = '';
  distance = signal('');
  duration = signal('');
  loading = signal(false); 

  private map!: L.Map;
  private fromMarker?: L.Marker;
  private toMarker?: L.Marker;
  private routeLayer?: L.GeoJSON;

  private selectingFrom = true;

  constructor(private api: MapService) {}

  ngAfterViewInit() {
    this.map = L.map('map').setView([12.9716, 77.5946], 12); // Bengaluru default
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    //  Handle manual clicks on map
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coords = [e.latlng.lat, e.latlng.lng] as [number, number];
      const myIcon = L.icon({
        iconUrl: 'https://res.cloudinary.com/dx0fji5gh/image/upload/v1759472833/generated-image_kcod12.jpg',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -35]
      });

      if (this.selectingFrom) {
        if (this.fromMarker) this.map.removeLayer(this.fromMarker);
        this.fromMarker = L.marker(coords, { icon: myIcon })
          .addTo(this.map)
          .bindPopup('From (manual)')
          .openPopup();

        this.fromCity = `${coords[0]},${coords[1]}`;
        this.selectingFrom = false;
      } else {
        if (this.toMarker) this.map.removeLayer(this.toMarker);
        this.toMarker = L.marker(coords, { icon: myIcon })
          .addTo(this.map)
          .bindPopup('To (manual)')
          .openPopup();

        this.toCity = `${coords[0]},${coords[1]}`;
        this.selectingFrom = true;

        // clear old route when new selection happens
        if (this.routeLayer) {
          this.map.removeLayer(this.routeLayer);
          this.distance.set('');
          this.duration.set('');
        }
      }
    });
  }

  async calculateRoute() {
    // If user used map clicks, just use markers directly 
    const fromCoords = this.fromMarker?.getLatLng();
    const toCoords = this.toMarker?.getLatLng();

    if (fromCoords && toCoords) {
      return this.fetchRoute([fromCoords.lat, fromCoords.lng], [toCoords.lat, toCoords.lng]);
    }

    // Otherwise, fallback to city search via API 
    if (!this.fromCity || !this.toCity) return;

    this.loading.set(true);

    this.api.searchCity(this.fromCity).pipe(
      catchError((error) => {
        console.error('API Error searching for departure city:', error);
        this.loading.set(false);
        alert('A network error occurred while searching for the departure city.');
        return of(null);
      })
    ).subscribe(from => {
      if (!from) {
        if (this.loading()) this.loading.set(false);
        return alert('Departure city not found.');
      }

      this.api.searchCity(this.toCity).pipe(
        catchError((error) => {
          console.error('API Error searching for destination city:', error);
          this.loading.set(false);
          alert('A network error occurred while searching for the destination city.');
          return of(null);
        })
      ).subscribe(to => {
        if (!to) {
          this.loading.set(false);
          return alert('Destination city not found.');
        }

        this.fetchRoute([from.lat, from.lon], [to.lat, to.lon]);
      });
    });
  }

  private fetchRoute(from: [number, number], to: [number, number]) {
    this.loading.set(true);

    this.api.getRoute(from, to).pipe(
      catchError((error) => {
        console.error('API Error fetching route:', error);
        alert('A network error occurred while calculating the route.');
        return of({ routes: [] });
      }),
      finalize(() => this.loading.set(false))
    ).subscribe(res => {
      if (!res.routes?.length) return alert('Route not found between the two locations.');
      const route = res.routes[0];

      if (this.routeLayer) this.map.removeLayer(this.routeLayer);

      this.routeLayer = L.geoJSON(route.geometry, {
        style: { color: 'blue', weight: 5 }
      }).addTo(this.map);

      this.map.fitBounds(this.routeLayer.getBounds());

      this.distance.set((route.distance / 1000).toFixed(2) + ' km');
      this.duration.set((route.duration / 60).toFixed(1) + ' mins');
    });
  }


  resetMap() {
  this.fromCity = '';
  this.toCity = '';
  this.distance.set('');
  this.duration.set('');
  this.loading.set(false);

  // Remove markers
  if (this.fromMarker) {
    this.map.removeLayer(this.fromMarker);
    this.fromMarker = undefined;
  }
  if (this.toMarker) {
    this.map.removeLayer(this.toMarker);
    this.toMarker = undefined;
  }

  // Remove route
  if (this.routeLayer) {
    this.map.removeLayer(this.routeLayer);
    this.routeLayer = undefined;
  }

  // Reset map view back to Bengaluru
  this.map.setView([12.9716, 77.5946], 12);
}

}
