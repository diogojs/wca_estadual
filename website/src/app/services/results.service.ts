import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  data_url: string = "https://raw.githubusercontent.com/diogojs/wca_statistics/backend/backend/data.json"

  constructor(private httpClient: HttpClient) { }

  getResults(): Observable<JSON> {
    return this.httpClient.get<JSON>(this.data_url);
  }
}
