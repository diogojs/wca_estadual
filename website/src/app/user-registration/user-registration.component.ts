import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
//import wcaSecrets from '../../../wcaauth.json'

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent {
  constructor(private authService: AuthenticationService) { }

  login(): void {
    if (this.authService.isLogged()) {
      return;
    }
    else {
      this.authService.login();
    }
  }

  isLogged(): boolean {
    return this.authService.isLogged();
  }

  getCurrentWcaId(): string {
    return sessionStorage.getItem("wca_id")!;
  }
}
