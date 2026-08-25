import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(
    endpoint: string,
    options?: {
      params?: HttpParams;
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  post<T>(
    endpoint: string,
    body: any,
    options?: {
      params?: HttpParams;
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  put<T>(
    endpoint: string,
    body: any,
    options?: {
      params?: HttpParams;
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  delete<T>(
    endpoint: string,
    options?: {
      params?: HttpParams;
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options);
  }
}