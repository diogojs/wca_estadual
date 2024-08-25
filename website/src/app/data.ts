export interface Result {
    name: string;
    result: string;
    state: string;
    competition: string;
}

export interface PersonResult {
    id: string;
    name: string;
    single: number;
    average: number;
    state: string;
    competitionSingle: string;
    competitionAverage: string;
}

export enum CubingEvent {
    e333 = '333',
    e444 = '444',
    e555 = '555',
    e666 = '666',
    e777 = '777',
    eminx = 'minx'
}