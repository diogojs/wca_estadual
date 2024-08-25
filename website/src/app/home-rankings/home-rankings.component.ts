import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CubingEvent, PersonResult, Result } from '../data';
import dataJson from '../data.json';

@Component({
  selector: 'app-home-rankings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-rankings.component.html',
  styleUrl: './home-rankings.component.scss'
})
export class HomeRankingsComponent implements OnInit {
  results: Record<string, PersonResult[]> = {};
  filteredResults: Array<Result> = [];

  currentEvent: string = "333";
  currentState: string = "";
  currentKindOfResult: string = "single";

  constructor() {}

  ngOnInit(): void {
    this.results = dataJson;

    this.updateFilteredResults();
  }

  updateFilteredResults(): void {
    let filtered = this.results[this.currentEvent].map(
      pResult => {
        let result = this.currentKindOfResult == "single" ?
                       pResult.single.toString() : pResult.average.toString();
        return {
          name: pResult.name,
          result: result,
          state: pResult.state,
          competition: this.currentKindOfResult == "single" ? pResult.competitionSingle : pResult.competitionAverage
        };
      }
    );

    if (this.currentState != "") {
      this.filteredResults = filtered.filter(
        result => (result.state == this.currentState)
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
