from markupsafe import escape
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)

OK_CODE = 42
USER_CREATED = 10
USER_UPDATED = 20
USER_NOT_UPDATED = 21
USER_NOT_FOUND = 30


class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wca_id = db.Column(db.String(16), unique=True, nullable=False)
    state = db.Column(db.String(100), nullable=False)
    last_updated = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f"User(wca_id={self.wca_id}, state={self.state})"

def get_event_results(event: str):
    return ''

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

    wca_id=escape(wca_id)
    state=escape(data['state'])
    # check wca_id do not exist yet
    # check state is valid
    today = datetime.now().date()
    new_user = UserModel(wca_id=wca_id, state=state, last_updated=today)
    db.session.add(new_user)
    db.session.commit()

    return {
        'code': USER_CREATED,
        'message': 'New user created'
        }

@app.put('/user/<wca_id>')
def update_user(wca_id):
    user = UserModel.query.filter_by(wca_id=wca_id).first()

    if not user:
        return {
            'code': USER_NOT_FOUND,
            'message': f'No user found with id {escape(wca_id)}'
            }
    
    today = datetime.now().date()
    if (today - user.last_updated).days < 1:
        return {
            'code': USER_NOT_UPDATED,
            'message': f'User was updated recently ({user.last_updated}). Not possible to update again.'
            }
    

    data = request.get_json()
    state=escape(data['state'])
    if user.state != state:
        user.state = state
        user.last_updated = today
        db.session.commit()

    return {
        'code': USER_UPDATED,
        'message': 'User updated correctly'
    }

@app.route('/e333', methods=['GET'])
def get_3x3():
    return get_event_results('333')

@app.route('/e444', methods=['GET'])
def get_4x4():
    return get_event_results('444')

@app.route('/e555', methods=['GET'])
def get_5x5():
    return get_event_results('555')


if __name__ == "__main__":
    app.run(debug=True)