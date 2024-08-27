import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  api_code: string = "";
  token: string = "";
  access_token_api: string = "/oauth/token/";
  data_url: string = "https://www.worldcubeassociation.org/api/v0/me"
  
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
    this.route.queryParamMap.subscribe(
      (query: any) => {
        let params = query['params'];
        if (params) {
          this.api_code = params['code'];
          if (this.api_code) {
            console.log(`api_code: ${this.api_code}`);
            this.requestToken();
          }
        }
      }
    )
  }

  login(): void {
    if (this.api_code == "" || this.api_code == undefined) {
      console.log("doing login");
      let redirectUrl = `https://www.worldcubeassociation.org/oauth/authorize?client_id=OS6jVGAcxX_MwpLawxS1hRq8IVNEfu-FAthO72ARdyw&redirect_uri=${environment.APP_URL}&response_type=code&scope=public`;
      sessionStorage.setItem("is_getting_token", "true");
      window.location.href = redirectUrl;
    }
  }

  requestToken(): void {
    // let cid = wcaSecrets.client_id;
    // let sec = wcaSecrets.secret;
    let cid = "OS6jVGAcxX_MwpLawxS1hRq8IVNEfu-FAthO72ARdyw";
    let sec = "OP_J3qaVdOVL0I5vTwzKwRsyY2EVq9xZRKM9KsofN1I";
    let api_params = {
      grant_type:'authorization_code',
      code:this.api_code,
      client_id:cid,
      client_secret:sec,
      redirect_uri:window.location.origin
    }
    console.log(api_params);
    this.httpClient.post<any>(this.access_token_api, api_params).subscribe(
      (response: any) => {
        this.token = response['access_token'];
        console.log(`Got token ${this.token}`);
        this.getUserWID();
      }
    )
  }

  getUserWID(): void {
    let headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    }
    this.httpClient.get<any>(this.data_url, {headers: headers}).subscribe(
      (response: any) => {
        let me = response['me']
        if (me) {
          sessionStorage.setItem("wca_id", me['wca_id']);
          if (location.search.includes("code="))
            location.search = "";
        }
      }
    )
  }

  isLogged(): boolean {
    let wcaid = sessionStorage.getItem("wca_id");
    return (wcaid != null)
  }
}
