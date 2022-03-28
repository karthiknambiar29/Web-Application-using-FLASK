from application.database import db
from werkzeug.security import generate_password_hash, check_password_hash

class Cards(db.Model):
    __tablename__ = 'cards'
    card_id = db.Column(db.Integer, primary_key=True)
    front = db.Column(db.String, nullable=False)
    answer = db.Column(db.Integer, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.category_id"), nullable=False)
    option_1 = db.Column(db.String, nullable=False)
    option_2 = db.Column(db.String, nullable=False)
    option_3 = db.Column(db.String, nullable=False)
    option_4 = db.Column(db.String, nullable=False)

class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)

    def __init__(self, name, password, email):
        self.name = name
        self.password = generate_password_hash(password)
        self.email = email
    
    def verify_password(self, pwd):
        return check_password_hash(self.password, pwd)

class Scores(db.Model):
    __tablename__ = 'scores'
    score_id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"),nullable=False)
    score = db.Column(db.Integer)
    datetime = db.Column(db.DateTime)
    category_id = db.Column(db.Integer, db.ForeignKey("category.category_id"), nullable=False)

    def __init__(self, user_id, score, datetime, category_id):
        self.user_id = user_id
        self.score = score
        self.datetime = datetime
        self.category_id = category_id

class Category(db.Model):
    __tablename__ = 'category'
    category_id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    def __init__(self, name, description):
        self.name = name
        self.description = description

