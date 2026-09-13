import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from './../services/loading-service';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  createTest(requestPayload: any): Observable<any> {
    this.loadingService.show();

    return this.http.post(
      `${this.apiUrl}/tests`,
      requestPayload
    ).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  fetchTest(studentId: any): Observable<any> {
    this.loadingService.show();

    return this.http.get(
      `${this.apiUrl}/tests/${studentId}`
    ).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  login(requestPayload: any): Observable<any> {
    this.loadingService.show();

    return this.http.post(
      `${this.apiUrl}/auth/login`,
      requestPayload
    ).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}