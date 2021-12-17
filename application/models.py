from application.database import db

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

    def __init__(self, name, password):
        self.name = name
        self.password = password

class Scores(db.Model):
    __tablename__ = 'scores'
    score_id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"),nullable=False)
    score = db.Column(db.Integer)
    datetime = db.Column(db.DateTime)
    category_id = db.Column(db.Integer, db.ForeignKey("category.category_id"), nullable=False)
    q1 = db.Column(db.Integer)
    q2 = db.Column(db.Integer)
    q3 = db.Column(db.Integer)
    q4 = db.Column(db.Integer)
    q5 = db.Column(db.Integer)
    q6 = db.Column(db.Integer)
    q7 = db.Column(db.Integer)
    q8 = db.Column(db.Integer)
    q9 = db.Column(db.Integer)
    q10 = db.Column(db.Integer)

    def __init__(self, user_id, score, datetime, category_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10):
        self.user_id = user_id
        self.score = score
        self.datetime = datetime
        self.category_id = category_id
        self.q1 = q1
        self.q2 = q2
        self.q3 = q3
        self.q4 = q4
        self.q5 = q5
        self.q6 = q6
        self.q7 = q7
        self.q8 = q8
        self.q9 = q9
        self.q10 = q10

class Category(db.Model):
    __tablename__ = 'category'
    category_id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    def __init__(self, name, description):
        self.name = name
        self.description = description

