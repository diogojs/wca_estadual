import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeRankingsComponent } from './home-rankings/home-rankings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeRankingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'website';
}
