import { Routes } from '@angular/router';
import { HomeRankingsComponent } from './home-rankings/home-rankings.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

export const routes: Routes = [
    { path: '', component: HomeRankingsComponent },
    { path: 'register', component: UserRegistrationComponent },
];
