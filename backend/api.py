import json
import logging
import requests
from os import environ

from markupsafe import escape
from datetime import datetime
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

from constants import STATES

logger = logging.getLogger(__name__)
logging.basicConfig(filename='api.log', level=logging.INFO)
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)
CORS(app)

CLIENT_ID = environ.get('API_CLIENT_ID')
CLIENT_SECRET = environ.get('API_CLIENT_SECRET')
ADM_TOKEN = environ.get('API_ADM_TOKEN')
DATA_FILE = 'data.json'

OK_CODE = 42
USER_CREATED = 10
USER_NOT_CREATED = 11
USER_UPDATED = 20
USER_NOT_UPDATED = 21
USER_NOT_FOUND = 30

if CLIENT_ID is None or CLIENT_SECRET is None:
    print('API_CLIENT_ID and API_CLIENT_SECRET must be set through environment variables.')
    exit(1)


class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wca_id = db.Column(db.String(16), unique=True, nullable=False)
    state = db.Column(db.String(100), nullable=False)
    last_updated = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f"User(wca_id={self.wca_id}, state={self.state})"


@app.route('/')
def home():
    return "Flask REST API"

@app.get('/user/<wca_id>')
def get_user_by_id(wca_id):
    user = UserModel.query.filter_by(wca_id=wca_id).first()

    if not user:
        return {
            'code': USER_NOT_FOUND,
            'message': f'No user found with id {escape(wca_id)}'
            }
    
    user_data = {
        'wca_id': user.wca_id,
        'state': user.state,
        'last_updated': user.last_updated
    }
    return {'code': OK_CODE, 'user': user_data}

@app.post('/user/<wca_id>')
def create_user(wca_id):
    data = request.get_json()

    state = get_escaped(data, 'state')
    access_token = get_escaped(data, 'access_token')
    if state is None or access_token is None:
        return "BadRequest. Missing state or access_token.", 400

    user_wca_id = get_wca_id_from_token(access_token) if access_token != ADM_TOKEN else wca_id
    if wca_id != user_wca_id:
        logger.warning(f'CREATE_USER: Route wca_id ({wca_id}) different from wca/me ({user_wca_id}). Access token: {access_token}')
        return {
            'code': USER_NOT_CREATED,
            'message': f'User informed ({wca_id}) different from the one logged in WCA.'
        }

    # check wca_id do not exist yet
    if UserModel.query.filter_by(wca_id=user_wca_id).first() is not None:
        return {
            'code': USER_NOT_CREATED,
            'message': f'User {user_wca_id} already exists.'
        }

    # check state is valid
    if state not in STATES:
        return {
            'code': USER_NOT_CREATED,
            'message': f'State {state} not valid.'
        }

    today = datetime.now().date()
    new_user = UserModel(wca_id=user_wca_id, state=state, last_updated=today)
    db.session.add(new_user)
    db.session.commit()

    return {
        'code': USER_CREATED,
        'message': 'New user created'
        }

@app.put('/user/<wca_id>')
def update_user(wca_id):
    data = request.get_json()

    state = get_escaped(data, 'state')
    access_token = get_escaped(data, 'access_token')
    if state is None or access_token is None:
        return "BadRequest. Missing state or access_token.", 400

    user_wca_id = get_wca_id_from_token(access_token)
    if wca_id != user_wca_id:
        logger.warning(f'UPDATE_USER: Route wca_id ({wca_id}) different from wca/me ({user_wca_id}). Access token: {access_token}')
        return {
            'code': USER_NOT_CREATED,
            'message': f'User informed ({wca_id}) different from the one logged in WCA.'
        }

    user = UserModel.query.filter_by(wca_id=user_wca_id).first()

    if not user:
        return {
            'code': USER_NOT_FOUND,
            'message': f'No user found with id {user_wca_id}'
            }

    today = datetime.now().date()
    # if (today - user.last_updated).days < 1:
    #     return {
    #         'code': USER_NOT_UPDATED,
    #         'message': f'User was updated recently ({user.last_updated}). Not possible to update again.'
    #         }

    if user.state != state:
        user.state = state
        user.last_updated = today
        db.session.commit()

    return {
        'code': USER_UPDATED,
        'message': 'User updated correctly'
    }


@app.post('/token/<code>')
@cross_origin()
def get_token(code):
    data = request.get_json()

    redirect_uri = get_escaped(data, 'redirect_uri')

    api_params = {
      'grant_type': 'authorization_code',
      'code': code,
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'redirect_uri': redirect_uri
    }
    wca_token_url = 'https://www.worldcubeassociation.org/oauth/token/'
    response = requests.post(wca_token_url, api_params)
    
    if response.status_code != 200:
        msg = f'Error trying to get token from WCA.\nStatus: {response.status_code}\nHeaders: {response.headers}\nContent: {response.content}'
        logger.error(msg)
        return "Error trying to get token from WCA.", response.status_code
    
    j = response.json()
    access_token = j.get('access_token')

    return {
        'access_token': access_token,
    }

@app.get('/ranking')
def get_ranking_file():
    with open(DATA_FILE, 'r') as jfile:
        data = json.load(jfile)

    return data

def get_wca_id_from_token(access_token: str) -> str:
    # get wca_id and name (/me) using token
    wca_user_url = "https://www.worldcubeassociation.org/api/v0/me"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.get(wca_user_url, headers=headers)
    if response.status_code != 200:
        return ''

    j = response.json()
    user = j.get('me')
    if user:
        return user['wca_id']
    else:
        return ''

def get_escaped(data: dict, field: str):
    value = data.get(field)
    if value:
        return escape(value)
    return None


if __name__ == "__main__":
    app.run(debug=True)