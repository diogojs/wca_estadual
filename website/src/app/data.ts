export interface Result {
    name: string;
    result: number;
    state: string;
    competition: string;
}

export interface PersonResult {
    id: string;
    single: number | undefined;
    average: number | undefined;
    // competitionSingle: string;
    // competitionAverage: string;
}

export interface UserResponse {
    code: number;
    user: User;
}

export interface User {
    wca_id: string;
    state: string;
    last_updated: string;
}

export enum CubingEvent {
    e333 = '333',
    e444 = '444',
    e555 = '555',
    e666 = '666',
    e777 = '777',
    eminx = 'minx'
}

export enum ApiCodes {
    OK_CODE = 42,
    USER_CREATED = 10,
    USER_NOT_CREATED = 11,
    USER_UPDATED = 20,
    USER_NOT_UPDATED = 21,
    USER_NOT_FOUND = 30
}

export interface State {
    abbrev: string,
    name: string
}