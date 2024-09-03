import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { ApiCodes, State, User } from '../data';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
            console.log('Current user:');
            console.log(this.userData);
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
    if (this.userData) {
      this.authService.updateUser(this.userData).subscribe(
        response => {
          console.log(response);
        }
      );
    } else {
      this.authService.createUser(
        {
          wca_id: this.getCurrentWcaId(),
          state: this.dropDownForm.get('stateForm')?.value,
          last_updated: 'useless'
        }).subscribe(
          response => {
            console.log(response);
          }
        );
    }
  }

  isLogged(): boolean {
    return this.authService.isLogged();
  }

  getCurrentWcaId(): string {
    return sessionStorage.getItem("wca_id")!;
  }
}
