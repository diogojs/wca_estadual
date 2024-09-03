import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Result } from '../data';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ResultsService } from '../services/results.service';


@Component({
  selector: 'app-home-rankings',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './home-rankings.component.html',
  styleUrl: './home-rankings.component.scss'
})
export class HomeRankingsComponent implements OnInit {
  results: Record<string, any> = {};
  filteredResults: Array<Result> = [];

  currentEvent: string = "333";
  currentState: string = "";
  currentKindOfResult: string = "single";

  constructor(private resultsService: ResultsService) { }

  ngOnInit(): void {
    this.results = {"competitors": {}, "results": {"single": {"333": []}} }
    this.resultsService.getResults().subscribe(
      (response: JSON) => {
        this.results = response;
        this.updateFilteredResults();
      }
    )

    this.updateFilteredResults();
  }

  updateFilteredResults(): void {
    let filtered = this.results['results'][this.currentKindOfResult][this.currentEvent].map(
      (pResult: any) => {
        return {
          name: this.results['competitors'][pResult.id].name,
          result: pResult[this.currentKindOfResult],
          state: this.results['competitors'][pResult.id].state,
          competition: ""
        };
      }
    );

    if (this.currentState != "") {
      this.filteredResults = filtered.filter(
        (result: Result) => (result.state == this.currentState)
      );
    } else {
      this.filteredResults = filtered;
    }
  }

  changeEventTo(cubingEvent: string): void {
    this.currentEvent = cubingEvent;
    this.updateFilteredResults();
  }

  changeStateTo(state: string): void {
    this.currentState = state;
    this.updateFilteredResults();
  }

  changeKindTo(kind: string): void {
    this.currentKindOfResult = kind;
    this.updateFilteredResults();
  }
}
