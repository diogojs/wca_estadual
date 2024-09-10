import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { ApiCodes, State, User } from '../data';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent implements OnInit {
  userData: User | undefined;
  states: State[] = [
    {name: 'Acre', abbrev: 'AC'},
    {name: 'Alagoas', abbrev: 'AL'},
    {name: 'Amapá', abbrev: 'AP'},
    {name: 'Amazonas', abbrev: 'AM'},
    {name: 'Bahia', abbrev: 'BA'},
    {name: 'Ceará', abbrev: 'CE'},
    {name: 'Espírito Santo', abbrev: 'ES'},
    {name: 'Goiás', abbrev: 'GO'},
    {name: 'Maranhão', abbrev: 'MA'},
    {name: 'Mato Grosso', abbrev: 'MT'},
    {name: 'Mato Grosso do Sul', abbrev: 'MS'},
    {name: 'Minas Gerais', abbrev: 'MG'},
    {name: 'Pará', abbrev: 'PA'},
    {name: 'Paraíba', abbrev: 'PB'},
    {name: 'Paraná', abbrev: 'PR'},
    {name: 'Pernambuco', abbrev: 'PE'},
    {name: 'Piauí', abbrev: 'PI'},
    {name: 'Rio de Janeiro', abbrev: 'RJ'},
    {name: 'Rio Grande do Norte', abbrev: 'RN'},
    {name: 'Rio Grande do Sul', abbrev: 'RS'},
    {name: 'Rondônia', abbrev: 'RO'},
    {name: 'Roraima', abbrev: 'RR'},
    {name: 'Santa Catarina', abbrev: 'SC'},
    {name: 'São Paulo', abbrev: 'SP'},
    {name: 'Sergipe', abbrev: 'SE'},
    {name: 'Tocantins', abbrev: 'TO'},
    {name: 'Distrito Federal', abbrev: 'DF'}
  ]
  dropDownForm: FormGroup;

  processing = false;
  updated = false;
  error_msg = "";
  success_msg = "";

  constructor(private authService: AuthenticationService) { 
    this.dropDownForm = new FormGroup({
      stateForm: new FormControl(null)
    });
  }
  
  ngOnInit(): void {
    if (this.authService.isLogged()) {
      // get user
      this.authService.getUserData(this.getCurrentWcaId()).subscribe(
        (response: any) => {
          let stateForm = this.dropDownForm.get('stateForm');

          // TODO: check response.status_code
          if (response['code'] == ApiCodes.OK_CODE) {
            this.userData = response['user'];
            stateForm?.setValue(this.userData!.state)
          } else if (response['code'] == ApiCodes.USER_NOT_FOUND){
            console.log("User do not exist yet.");
          }

          stateForm?.valueChanges.subscribe(
            (value: string) => {
              if (this.userData) {
                this.userData.state = value;
              }
            }
          )
        }
      );
    }
  }

  login(): void {
    if (this.authService.isLogged()) {
      return;
    }
    else {
      this.authService.login();
    }
  }

  submit(): void {
    this.processing = true;
    if (this.userData) {
      this.authService.updateUser(this.userData).subscribe({
        next: (response) => {
          this.handleResponse(response, ApiCodes.USER_UPDATED, ApiCodes.USER_NOT_UPDATED);
        },
        error: (error) => {
          console.log('An error occurred:', error);
          this.setError("Algo deu errado. Verifique se você preencheu todos os dados corretamente ou tente novamente mais tarde.");
        },
        complete: () => {}
      });
    } else {
      this.authService.createUser(
        {
          wca_id: this.getCurrentWcaId(),
          state: this.dropDownForm.get('stateForm')?.value,
          last_updated: 'useless'
        }).subscribe({
            next: (response) => {
              this.handleResponse(response, ApiCodes.USER_CREATED, ApiCodes.USER_NOT_CREATED);
            },
            error: (error) => {
              console.log('An error occurred:', error);
              this.setError("Algo deu errado. Verifique se você preencheu todos os dados corretamente ou tente novamente mais tarde.");
            },
            complete: () => {}
        });
    }
  }

  handleResponse(response: any, success: number, fail: number): void {
    console.log(response);
    let return_code = response['code'];
    if (return_code == success)
      this.setSuccess(response['message']);
    else if (return_code == fail)
      this.setError(response['message']);
    else {
      this.setError("Algo deu errado. Tente novamente mais tarde.");
      console.log(`Error on creating/updating user. Code: ${return_code}`);
      if (return_code == undefined)
        console.log(response);
    }
    this.processing = false;
  }

  setSuccess(msg: string): void {
    this.success_msg = msg;
    this.error_msg = "";
    this.processing = false;
  }

  setError(msg: string): void {
    this.error_msg = msg;
    this.success_msg = "";
    this.processing = false;
  }

  isLogged(): boolean {
    return this.authService.isLogged();
  }

  getCurrentWcaId(): string {
    return sessionStorage.getItem("wca_id")!;
  }
}
