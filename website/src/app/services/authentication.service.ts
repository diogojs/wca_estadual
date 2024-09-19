import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../data';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  api_code: string = "";
  data_url: string = "https://www.worldcubeassociation.org/api/v0/me";
  public loadingToken: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.route.queryParamMap.subscribe(
      (query: any) => {
        let params = query['params'];
        if (params) {
          this.api_code = params['code'];
          if (this.api_code) {
            this.loadingToken = true;
            console.log(`api_code: ${this.api_code}`);
            this.requestToken();
          }
        }
      }
    )
  }

  token(): string {
    let tkn = sessionStorage.getItem("access_token");
    return tkn ? tkn : "";
  }

  login(): void {
    if (this.api_code == "" || this.api_code == undefined) {
      let redirectUrl = `https://www.worldcubeassociation.org/oauth/authorize?client_id=OS6jVGAcxX_MwpLawxS1hRq8IVNEfu-FAthO72ARdyw&redirect_uri=${environment.APP_URL}&response_type=code&scope=public`;
      sessionStorage.setItem("is_getting_token", "true");
      window.location.href = redirectUrl;
    }
  }

  requestToken(): void {
    let api_params = {
      redirect_uri:window.location.origin
    }
    console.log(api_params);
    this.httpClient.post<any>(`${environment.BACKEND_URL}/token/${this.api_code}`, api_params).subscribe({
      next: (response: any) => {
        // TODO: check if there is no token
        sessionStorage.setItem("access_token", response['access_token']);
        console.log(`Got token ${this.token()}`);
        this.getUserWID();
      },
      error: (error) => {
        console.log('An error occurred:', error);
        this.loadingToken = false;
      },
      complete: () => {}
    })
  }

  getUserData(wca_id: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.BACKEND_URL}/user/${wca_id}`)
  }

  createUser(userData: User): Observable<any> {
    let body = {
      state: userData.state,
      access_token: this.token(),
    };
    return this.httpClient.post<any>(`${environment.BACKEND_URL}/user/${userData.wca_id}`, body);
  }

  updateUser(userData: User): Observable<any> {
    let body = {
      state: userData.state,
      access_token: this.token(),
    };
    console.log("Putting");
    console.log(body);
    return this.httpClient.put<any>(`${environment.BACKEND_URL}/user/${userData.wca_id}`, body);
  }

  getUserWID(): void {
    let headers = {
      'Authorization': `Bearer ${this.token()}`,
      'Content-Type': 'application/json'
    }
    this.httpClient.get<any>(this.data_url, {headers: headers}).subscribe({
      next: (response: any) => {
        let me = response['me']
        if (me) {
          sessionStorage.setItem("wca_id", me['wca_id']);
        }
        this.loadingToken = false;
        this.router.navigate(['register']);
      },
      error: (error) => {
        console.log('An error occurred:', error);
        this.loadingToken = false;
      },
      complete: () => {}
    })
  }

  isLogged(): boolean {
    let wcaid = sessionStorage.getItem("wca_id");
    return (wcaid != null)
  }
}
