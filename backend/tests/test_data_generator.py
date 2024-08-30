from ..data_generator import get_ranking_for_event, competitors

def test_ranking_for_event():
    competitors.clear()
    competitors.extend([
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
    ])

    single333 = get_ranking_for_event('333', 'single')
    assert single333 == [
        {'id': '2023BERT03', 'name': 'César Octávio Bertoncini', 'single': 1379, 'state': 'SC'},
        {'id': '2022SOUZ13', 'name': 'Diogo Junior de Souza', 'single': 1497, 'state': 'SC'},
        {'id': '2022FULA09', 'name': 'Fulano Hoffmann', 'single': 1752, 'state': 'SP'}
    ]

    single3bf = get_ranking_for_event('333bf', 'single')
    assert single3bf == [
        {'id': '2022SOUZ13', 'name': 'Diogo Junior de Souza', 'single': 11663, 'state': 'SC'},
        {'id': '2023BERT03', 'name': 'César Octávio Bertoncini', 'single': 11678, 'state': 'SC'}
    ]

    average3bf = get_ranking_for_event('333bf', 'average')
    assert average3bf == [
        {'id': '2022SOUZ13', 'name': 'Diogo Junior de Souza', 'average': 17436, 'state': 'SC'},
    ]