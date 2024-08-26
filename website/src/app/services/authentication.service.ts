import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  api_code: string = "";
  token: string = "";
  wcaid: string = "";
  access_token_url: string = "https://www.worldcubeassociation.org/oauth/token"
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
          console.log(this.api_code);
        }
      }
    )
  }

  login(): void {
    console.log("doing login");
    if (this.api_code == "" || this.api_code == undefined) {
      console.log("do not have api_code");
      let redirectUrl = `https://www.worldcubeassociation.org/oauth/authorize?client_id=OS6jVGAcxX_MwpLawxS1hRq8IVNEfu-FAthO72ARdyw&redirect_uri=${window.location.origin + window.location.pathname}&response_type=code&scope=public`;
      console.log(redirectUrl);
      sessionStorage.setItem("is_getting_token", "true");
      window.location.href = redirectUrl;
    } else {
      console.log("has api_code");
      this.requestToken();
    }
  }

  requestToken(): void {
    // let cid = wcaSecrets.client_id;
    // let sec = wcaSecrets.secret;
    console.log("requesting token")
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
    this.httpClient.post<any>(this.access_token_url, api_params).subscribe(
      (response: object) => {
        console.log("Json object: ");
        console.log(response);
      }
    )
  }

  isLogged(): boolean {
    return (this.token != "")
  }
}
