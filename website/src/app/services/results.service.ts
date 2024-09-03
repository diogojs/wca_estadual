import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  constructor(private httpClient: HttpClient) { }

  getResults(): Observable<JSON> {
    return this.httpClient.get<JSON>(`${environment.BACKEND_URL}/ranking`);
  }
}
