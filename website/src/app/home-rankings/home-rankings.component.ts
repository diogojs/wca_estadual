import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CubingEvent, PersonResult, Result } from '../data';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
//import dataJson from '../data.json';

@Component({
  selector: 'app-home-rankings',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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
    // this.results = dataJson;
    this.results = {
      "333":
      [
          {
              "id": "2012SATO03",
              "name": "Caio Hideaki Sato",
              "single":	4.37,
              "average": 5.30,
              "state": "SP",
              "competitionSingle": "Etec Cubatão 2022",
              "competitionAverage": "Etec Cubatão 2023"
          },
          {
              "id": "2014CECC01",
              "name": "Vicenzo Guerino Cecchini",
              "single":	4.86,
              "average": 6.21,
              "state": "SP",
              "competitionSingle": "Colégio Asther Open 2023",
              "competitionAverage": "Colégio 2024"
          },
          {
              "id": "2016MAND01",
              "name": "Francisco Moraes Mandalozzo",
              "single":	5.07,
              "average": 6.25,
              "state": "PR",
              "competitionSingle": "Opentrópolis CEFET 2024",
              "competitionAverage": "Open 2024"
          },
          {
              "id": "2012SATO03",
              "name": "Antonio Gabriel Silva",
              "single":	5.58,
              "average": 6.31,
              "state": "SC",
              "competitionSingle": "South American Championship 2018",
              "competitionAverage": "SAC 2020"
          },
          {
              "id": "2012SATO03",
              "name": "Tiago Akihiro Fujita",
              "single":	5.68,
              "average": 6.41,
              "state": "SP",
              "competitionSingle": "BioAteneu Santos 2023",
              "competitionAverage": "BioAteneu 2024"
          }
      ],
      "444":
      [
          {
              "id": "2012SATO03",
              "name": "Caio Hideaki Sato",
              "single":	24.37,
              "average": 25.30,
              "state": "SP",
              "competitionSingle": "Etec Cubatão 2022",
              "competitionAverage": "Etec Cubatão 2023"
          },
          {
              "id": "2014CECC01",
              "name": "Vicenzo Guerino Cecchini",
              "single": 24.86,
              "average": 26.21,
              "state": "SP",
              "competitionSingle": "Colégio Asther Open 2023",
              "competitionAverage": "Colégio 2024"
          },
          {
              "id": "2016MAND01",
              "name": "Francisco Moraes Mandalozzo",
              "single": 25.07,
              "average": 26.25,
              "state": "PR",
              "competitionSingle": "Opentrópolis CEFET 2024",
              "competitionAverage": "Open 2024"
          },
          {
              "id": "2012SATO03",
              "name": "Antonio Gabriel Silva",
              "single": 25.58,
              "average": 26.31,
              "state": "SC",
              "competitionSingle": "South American Championship 2018",
              "competitionAverage": "SAC 2020"
          },
          {
              "id": "2012SATO03",
              "name": "Tiago Akihiro Fujita",
              "single": 25.68,
              "average": 26.41,
              "state": "SP",
              "competitionSingle": "BioAteneu Santos 2023",
              "competitionAverage": "BioAteneu 2024"
          }
      ],
      "555": [],
      "666": [],
      "777": [],
      "minx": []
  }

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
