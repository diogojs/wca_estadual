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
  tabledResults: Array<Result> = [];

  events: string[] = ["222", "333bf", "333", "333fm", "333mbf", "333oh", "333ft", "444bf", "444", "555bf", "555", "666", "777", "clock", "minx", "pyram", "skewb", "sq1"];
  states = [
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

  currentEvent: string = "333";
  currentState: string = "";
  currentKindOfResult: string = "single";
  
  currentPage: number = 1;
  resultsPerPage: number = 3;
  lastPage: number = 999;

  constructor(private resultsService: ResultsService) { }

  ngOnInit(): void {
    let mock = {
        "competitors": {
            "2013FORT01": {
                "name": "Christian de Sena Fortunato",
                "state": "SC"
            },
            "2022KLAP01": {
                "name": "Augusto Agostini Klappoth",
                "state": "SC"
            },
            "2022SOUZ13": {
                "name": "Diogo Junior de Souza",
                "state": "SC"
            },
            "2023BERT03": {
                "name": "César Octávio Bertoncini",
                "state": "SC"
            },
            "2023HUBN01": {
                "name": "Gustavo Dreyer Hübner",
                "state": "SC"
            },
            "2023KLAP01": {
                "name": "Evandro Klappoth",
                "state": "SC"
            },
            "2023KLAP03": {
                "name": "Ana Carolini Agostini Klappoth",
                "state": "SC"
            },
            "2023MEND17": {
                "name": "Artur Augusto Mendes",
                "state": "SC"
            }
        },
        "results": {
            "average": {
                "222": [
                    {
                        "average": 264,
                        "id": "2013FORT01"
                    },
                    {
                        "average": 342,
                        "id": "2023MEND17"
                    },
                    {
                        "average": 472,
                        "id": "2022KLAP01"
                    },
                    {
                        "average": 661,
                        "id": "2022SOUZ13"
                    },
                    {
                        "average": 673,
                        "id": "2023BERT03"
                    },
                    {
                        "average": 716,
                        "id": "2023HUBN01"
                    }
                ],
                "333": [
                    {
                        "average": 832,
                        "id": "2013FORT01"
                    },
                    {
                        "average": 922,
                        "id": "2023MEND17"
                    },
                    {
                        "average": 1010,
                        "id": "2022KLAP01"
                    },
                    {
                        "average": 1713,
                        "id": "2023BERT03"
                    },
                    {
                        "average": 1714,
                        "id": "2022SOUZ13"
                    },
                    {
                        "average": 2344,
                        "id": "2023HUBN01"
                    },
                    {
                        "average": 3601,
                        "id": "2023KLAP03"
                    },
                    {
                        "average": 5078,
                        "id": "2023KLAP01"
                    }
                ],
                "333bf": [
                    {
                        "average": 17436,
                        "id": "2022SOUZ13"
                    }
                ],
                "333fm": [],
                "333ft": [],
                "333mbf": [],
                "333oh": [
                    {
                        "average": 1653,
                        "id": "2013FORT01"
                    },
                    {
                        "average": 1787,
                        "id": "2023MEND17"
                    },
                    {
                        "average": 1947,
                        "id": "2022KLAP01"
                    },
                    {
                        "average": 4109,
                        "id": "2022SOUZ13"
                    },
                    {
                        "average": 7558,
                        "id": "2023HUBN01"
                    }
                ],
                "444": [
                    {
                        "average": 2911,
                        "id": "2013FORT01"
                    },
                    {
                        "average": 5616,
                        "id": "2022KLAP01"
                    },
                    {
                        "average": 7051,
                        "id": "2023BERT03"
                    },
                    {
                        "average": 7870,
                        "id": "2022SOUZ13"
                    },
                    {
                        "average": 10879,
                        "id": "2023KLAP03"
                    }
                ],
                "444bf": [],
                "555": [
                    {
                        "average": 6444,
                        "id": "2013FORT01"
                    }
                ],
                "555bf": [],
                "666": [
                    {
                        "average": 17509,
                        "id": "2013FORT01"
                    }
                ],
                "777": [
                    {
                        "average": 28320,
                        "id": "2013FORT01"
                    }
                ],
                "clock": [
                    {
                        "average": 871,
                        "id": "2023HUBN01"
                    },
                    {
                        "average": 945,
                        "id": "2022KLAP01"
                    },
                    {
                        "average": 1058,
                        "id": "2023KLAP03"
                    },
                    {
                        "average": 1206,
                        "id": "2023BERT03"
                    },
                    {
                        "average": 1261,
                        "id": "2022SOUZ13"
                    },
                    {
                        "average": 1888,
                        "id": "2023KLAP01"
                    }
                ],
                "minx": [
                    {
                        "average": 8306,
                        "id": "2023MEND17"
                    },
                    {
                        "average": 11931,
                        "id": "2022SOUZ13"
                    },
                    {
                        "average": 13926,
                        "id": "2023BERT03"
                    },
                    {
                        "average": 19364,
                        "id": "2023KLAP03"
                    }
                ],
                "pyram": [
                    {
                        "average": 828,
                        "id": "2013FORT01"
                    },
                    {
                        "average": 883,
                        "id": "2023MEND17"
                    },
                    {
                        "average": 925,
                        "id": "2022KLAP01"
                    },
                    {
                        "average": 988,
                        "id": "2023BERT03"
                    },
                    {
                        "average": 1132,
                        "id": "2023KLAP03"
                    },
                    {
                        "average": 1173,
                        "id": "2022SOUZ13"
                    },
                    {
                        "average": 1440,
                        "id": "2023HUBN01"
                    }
                ],
                "skewb": [
                    {
                        "average": 561,
                        "id": "2023MEND17"
                    },
                    {
                        "average": 592,
                        "id": "2022KLAP01"
                    },
                    {
                        "average": 745,
                        "id": "2013FORT01"
                    },
                    {
                        "average": 836,
                        "id": "2023BERT03"
                    },
                    {
                        "average": 1479,
                        "id": "2023KLAP03"
                    },
                    {
                        "average": 1809,
                        "id": "2022SOUZ13"
                    },
                    {
                        "average": 2519,
                        "id": "2023HUBN01"
                    }
                ],
                "sq1": []
            },
            "single": {
                "222": [
                    {
                        "id": "2013FORT01",
                        "single": 149
                    },
                    {
                        "id": "2022KLAP01",
                        "single": 219
                    },
                    {
                        "id": "2023MEND17",
                        "single": 233
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 425
                    },
                    {
                        "id": "2023HUBN01",
                        "single": 455
                    },
                    {
                        "id": "2023BERT03",
                        "single": 554
                    }
                ],
                "333": [
                    {
                        "id": "2013FORT01",
                        "single": 677
                    },
                    {
                        "id": "2023MEND17",
                        "single": 739
                    },
                    {
                        "id": "2022KLAP01",
                        "single": 830
                    },
                    {
                        "id": "2023BERT03",
                        "single": 1379
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 1497
                    },
                    {
                        "id": "2023HUBN01",
                        "single": 2066
                    },
                    {
                        "id": "2023KLAP03",
                        "single": 3033
                    },
                    {
                        "id": "2023KLAP01",
                        "single": 4630
                    }
                ],
                "333bf": [
                    {
                        "id": "2022SOUZ13",
                        "single": 11663
                    }
                ],
                "333fm": [
                    {
                        "id": "2013FORT01",
                        "single": 41
                    }
                ],
                "333ft": [],
                "333mbf": [
                    {
                        "id": "2022SOUZ13",
                        "single": 940233800
                    }
                ],
                "333oh": [
                    {
                        "id": "2013FORT01",
                        "single": 1203
                    },
                    {
                        "id": "2022KLAP01",
                        "single": 1480
                    },
                    {
                        "id": "2023MEND17",
                        "single": 1615
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 2720
                    },
                    {
                        "id": "2023BERT03",
                        "single": 4693
                    },
                    {
                        "id": "2023HUBN01",
                        "single": 6296
                    }
                ],
                "444": [
                    {
                        "id": "2013FORT01",
                        "single": 2497
                    },
                    {
                        "id": "2022KLAP01",
                        "single": 4468
                    },
                    {
                        "id": "2023BERT03",
                        "single": 6359
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 7453
                    },
                    {
                        "id": "2023KLAP03",
                        "single": 9186
                    },
                    {
                        "id": "2023HUBN01",
                        "single": 13877
                    }
                ],
                "444bf": [],
                "555": [
                    {
                        "id": "2013FORT01",
                        "single": 5617
                    },
                    {
                        "id": "2023BERT03",
                        "single": 15351
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 19827
                    }
                ],
                "555bf": [],
                "666": [
                    {
                        "id": "2013FORT01",
                        "single": 15446
                    }
                ],
                "777": [
                    {
                        "id": "2013FORT01",
                        "single": 27103
                    }
                ],
                "clock": [
                    {
                        "id": "2023HUBN01",
                        "single": 723
                    },
                    {
                        "id": "2022KLAP01",
                        "single": 745
                    },
                    {
                        "id": "2023KLAP03",
                        "single": 946
                    },
                    {
                        "id": "2023BERT03",
                        "single": 979
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 1203
                    },
                    {
                        "id": "2023KLAP01",
                        "single": 1588
                    }
                ],
                "minx": [
                    {
                        "id": "2023MEND17",
                        "single": 7142
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 9976
                    },
                    {
                        "id": "2023BERT03",
                        "single": 13670
                    },
                    {
                        "id": "2023KLAP03",
                        "single": 16436
                    }
                ],
                "pyram": [
                    {
                        "id": "2013FORT01",
                        "single": 553
                    },
                    {
                        "id": "2023MEND17",
                        "single": 574
                    },
                    {
                        "id": "2022KLAP01",
                        "single": 605
                    },
                    {
                        "id": "2023BERT03",
                        "single": 707
                    },
                    {
                        "id": "2023KLAP03",
                        "single": 716
                    },
                    {
                        "id": "2023HUBN01",
                        "single": 951
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 995
                    }
                ],
                "skewb": [
                    {
                        "id": "2022KLAP01",
                        "single": 294
                    },
                    {
                        "id": "2023MEND17",
                        "single": 351
                    },
                    {
                        "id": "2013FORT01",
                        "single": 473
                    },
                    {
                        "id": "2023BERT03",
                        "single": 595
                    },
                    {
                        "id": "2023KLAP03",
                        "single": 841
                    },
                    {
                        "id": "2022SOUZ13",
                        "single": 928
                    },
                    {
                        "id": "2023HUBN01",
                        "single": 1488
                    }
                ],
                "sq1": [
                    {
                        "id": "2022KLAP01",
                        "single": 10742
                    }
                ]
            }
        }
    }
    this.results = mock;
    this.updateFilteredResults();
    // this.resultsService.getResults().subscribe(
    //   (response: JSON) => {
    //     this.results = response;
    //     console.log(response);
    //     this.updateFilteredResults();
    //   }
    // )
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
    this.goToPage(0);
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

  viewResult(result: number): string {
    if (this.currentEvent == "333fm")
      return result.toString();
    
    // TODO: handle MultiBLD cases
    let seconds = result / 100;

    if (seconds > 60) {
      return this.convertToMinutes(seconds);
    } else {
      return (seconds).toFixed(2);
    }
  }

  convertToMinutes(seconds: number): string {
    let minutes = Math.floor(seconds / 60);
    let sec = seconds % 60;

    let paddedSec = sec < 10 ? `0${sec.toFixed(2)}` : sec.toFixed(2);
    return `${minutes}:${paddedSec}`;
  }

  goToPage(page: number): void {
    this.lastPage = Math.ceil(this.filteredResults.length / this.resultsPerPage) - 1;

    if (page < 0)
        page = 0;
    if (page > this.lastPage)
        page = this.lastPage;

    this.currentPage = page;
    this.updateTabledResults();
  }

  updateTabledResults(): void {
    let start = this.currentPage * this.resultsPerPage;
    let end = start + this.resultsPerPage;
    if (end >= this.filteredResults.length)
      end = this.filteredResults.length;
    this.tabledResults = this.filteredResults.slice(start, end);
  }

  goToLastPage(): void {
    this.goToPage(9999);
  }
}
