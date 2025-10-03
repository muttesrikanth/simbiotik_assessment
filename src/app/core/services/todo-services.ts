import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Todos {
  id?: number;
  title: string;
  description: string;
  isCompleted: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class TodoServices {
  private api = 'https://du-test-api.simbiotiktech.in/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todos[]> {
    return this.http.get<Todos[]>(this.api);
  }

  getTodo(id: number): Observable<Todos> {
    return this.http.get<Todos>(`${this.api}/${id}`);
  }

  create(todo: Todos): Observable<Todos> {
    return this.http.post<Todos>(this.api, todo);
  }

  update(id: number, todo: Todos): Observable<Todos> {
    return this.http.put<Todos>(`${this.api}/${id}`, todo);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
