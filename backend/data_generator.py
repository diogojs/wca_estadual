import datetime
import logging
import json
import requests
import sqlite3
import time
import os


logger = logging.getLogger(__name__)

ROBIN_URL = 'https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/'
RANK_ENDPOINT = 'rank/BR/'
PERSON_ENDPOINT = 'persons/'

DATABASE_FILE = "instance/database.db"
JSON_FILE = "data.json"
database_last_updated = 1

KINDS = ('single', 'average')
EVENTS = ("222", "333bf", "333", "333fm", "333mbf", "333oh", "333ft", "444bf", "444", "555bf", "555", "666", "777", "clock", "minx", "pyram", "skewb", "sq1")


def get_results(kind: str, event: str, page = 1):
    url = f'{ROBIN_URL}{RANK_ENDPOINT}{kind}/{event}.json'

"""
@returns
result = {
    "id": "2022SOUZ13",
    "name": "Diogo Junior de Souza",
    "ranks": {
        "singles": [
            {"eventId":"222","best":425,"rank":{"world":43347,"continent":3352,"country":783}},
            {"eventId":"333","best":1497,"rank":{"world":53361,"continent":4349,"country":1024}},
            ...
        ],
        "averages": [
            {"eventId":"222","best":661,"rank":{"world":49515,"continent":3543,"country":806}},
            {"eventId":"333","best":1714,"rank":{"world":47341,"continent":3751,"country":889}},
            ...
        ]
    }
}
"""
def get_results_by_id(wca_id: str):
    url = f'{ROBIN_URL}{PERSON_ENDPOINT}{wca_id}.json'
    r = requests.get(url)
    
    if r.status_code != 200:
        print(f'Result for {wca_id} not found.\n{r.status_code}')
        return
    
    j = r.json()
    result = {
        'id': j['id'],
        'name': j['name'],
        'ranks': j['rank']
    }
    return result

competitors = [
    {
        "id": "2022SOUZ13",
        "name": "Diogo Junior de Souza",
        "ranks": {
            "singles": [
                {"eventId":"222","best":425,"rank":{"world":43347,"continent":3352,"country":783}},
                {"eventId":"333","best":1497,"rank":{"world":53361,"continent":4349,"country":1024}},
                {"eventId":"333bf","best":11663,"rank":{"world":3012,"continent":178,"country":65}}
            ],
            "averages": [
                {"eventId":"222","best":661,"rank":{"world":49515,"continent":3543,"country":806}},
                {"eventId":"333","best":1714,"rank":{"world":47341,"continent":3751,"country":889}},
                {"eventId":"333bf","best":17436,"rank":{"world":3013,"continent":179,"country":66}}
            ]
        },
        "state": "SC"
    },
    {
        "id":"2022FULA09",
        "name":"Fulano Hoffmann",
        "ranks": {
            "singles": [
                {"eventId":"222","best":548,"rank":{"world":66790,"continent":5166,"country":1244}},
                {"eventId":"333","best":1752,"rank":{"world":72721,"continent":6078,"country":1466}},
            ],
            "averages": [
                {"eventId":"222","best":682,"rank":{"world":52871,"continent":3785,"country":871}},
                {"eventId":"333","best":2191,"rank":{"world":77106,"continent":6419,"country":1539}},
            ]
        },
        "state": "SP"
    },
    {
        "id":"2023BERT03",
        "name":"C\u00e9sar Oct\u00e1vio Bertoncini",
        "ranks": {
            "singles": [
                {"eventId":"222","best":554,"rank":{"world":67830,"continent":5243,"country":1260}},
                {"eventId":"333","best":1379,"rank":{"world":43983,"continent":3505,"country":823}},
                {"eventId":"333bf","best":11678,"rank":{"world":44093,"continent":3690,"country":1012}},
            ],
            "averages": [
                {"eventId":"222","best":673,"rank":{"world":51475,"continent":3690,"country":848}},
                {"eventId":"333","best":1713,"rank":{"world":47336,"continent":3744,"country":886}}
            ]
        },
        "state": "SC"
    }
]

"""
@params
event: '333', '444bf', ...
kind: 'single', 'average'

@returns
result = [
    {
        "id": "2012SATO03",
        "name": "Caio Hideaki Sato",
        "single": 437,
        "state": "SP"
    },
    {
        "id": "2014CECC01",
        "name": "Vicenzo Guerino Cecchini",
        "single": 486,
        "state": "SP"
    },
    ...
]
"""
def get_ranking_for_event(event: str, kind: str):
    filtered_competitors = [] # only competitors that have result for this event-kind
    for p in competitors:
        for ev in p['ranks'][f'{kind}s']:
            if ev['eventId'] == event:
                filtered_competitors.append({
                    'id': p['id'],
                    'name': p['name'],
                    kind: ev['best'],
                    'state': p['state']
                })
                break

    filtered_competitors.sort(key=lambda p: p[kind])
    return filtered_competitors

"""
Get users from database and merge with data from WCA /persons
"""
def get_competitors():
    logger.info('Getting competitors.')
    # get users from database
    conn = sqlite3.connect(DATABASE_FILE)
    users_table = conn.execute("SELECT * FROM user_model").fetchall()

    # for each user get/append data from WCA
    competitors = []
    for u in users_table:
        competitor = get_results_by_id(u[1])
        if (competitor is None):
            continue  # probably couldn't fetch user from WCA
        competitor['state'] = u[2]
        competitors.append(competitor)

    return competitors

"""
- Get competitors
- generate ranking for each event/kind combination
- save data to json file
"""
def generate_data_json():
    logger.info('Generating data.')
    global competitors
    competitors = get_competitors()

    logger.info('Getting rankings for events.')
    result = {}
    for kind in KINDS:
        result[kind] = {}
        for event in EVENTS:
            result[kind][event] = get_ranking_for_event(event, kind)

    """ example
    result = {
        'single': {
            '333': [
                {
                    "id": "2012SATO03",
                    "name": "Caio Hideaki Sato",
                    "single":	4.37,
                    "state": "SP"
                },
                {
                    "id": "2014CECC01",
                    "name": "Vicenzo Guerino Cecchini",
                    "single":	4.86,
                    "state": "SP"
                },
                ...
            ],
            '444': [
                {
                    "id": "2012SATO03",
                    "name": "Caio Hideaki Sato",
                    "single":	4.37,
                    "state": "SP"
                }, ...
            ]
        },
        'average': {
            '333': [
                {
                    "id": "2012SATO03",
                    "name": "Caio Hideaki Sato",
                    "single":	4.37,
                    "state": "SP"
                },
                ...
            ]
        }
    }
    """

    # generate data.json
    with open(JSON_FILE, "w") as outfile:
        json.dump(result, outfile)
    
    # send updated file to github


def sleepUntilTomorrow(hour, minute):
    t = datetime.datetime.today()
    future = datetime.datetime(t.year, t.month, t.day, hour, minute)
    if t.timestamp() > future.timestamp():
        future += datetime.timedelta(days=1)
    time.sleep((future-t).seconds)


def inner_database_is_updated() -> bool:
    global database_last_updated
    file_info = os.stat(DATABASE_FILE)
    modification_time = int(file_info.st_mtime)
    if modification_time > database_last_updated:
        database_last_updated = modification_time
        return True
    return False


def main():
    last_weekly_update = datetime.datetime.today()
    while True:
        try:
            today = datetime.datetime.today()
            if (today - last_weekly_update).days >= 7:  # update at least once a week to get new results from WCA
                generate_data_json()
                last_weekly_update = today
            else:
                if inner_database_is_updated():
                    generate_data_json()
                    last_weekly_update = today
        except Exception as e:
            logger.error('Error generating data json: ')
            logger.error(e.with_traceback())
        sleepUntilTomorrow(4, 0)


if __name__ == "__main__":
    logging.basicConfig(filename='data_generator.log', level=logging.INFO)
    main()

