from datetime import date, datetime
from flask_restful import Resource, Api
from flask_restful import fields, marshal_with
from flask_restful import reqparse
from application.validation import  NotFoundError, NewUserError
from application.models import Users, Scores, Cards, Category
from application.database import db
from flask import current_app as app
import werkzeug
from flask import abort, request, jsonify, make_response, json
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from random import shuffle
from datetime import datetime
from application import tasks
from werkzeug.security import generate_password_hash

class RegisterAPI(Resource):

    def post(self):
        username = request.json.get("name", None)
        password = request.json.get("password", None)
        email = request.json.get("email", None)
        user = Users.query.filter(Users.name==username).first()
        if user is not None:
            return {"msg":"Username Exists!"}, 404
        elif Users.query.filter(Users.email == email).first() is not None:
            return {"msg": "Email id already used!!"}, 404
        else:
            user = Users(name=username, password=password, email=email)
            db.session.add(user)
            db.session.commit()
            access_token = create_access_token(identity=user.user_id)
            return jsonify(access_token=access_token)

class UserAPI(Resource):

    def post(self):
        username = request.json.get('name', None) 
        password = request.json.get('password', None)
        
        user = Users.query.filter(Users.name==username).first()
        if user is None:
            return {"msg":"Username doesnot exists"}, 404
        if user is not None and user.verify_password(password):
            access_token = create_access_token(identity=user.user_id)
            return jsonify(access_token=access_token)
        else:
            return {"msg":"Incorrect Password"}, 404
    
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = Users.query.filter(Users.user_id == current_user).first()
        user_scores = Scores.query.filter(Scores.user_id == user.user_id).all()
        scores = []
        datetimes = []
        categories = []
        for user_score in user_scores:
            scores.append(user_score.score)
            datetimes.append(user_score.datetime.strftime("%b %d %Y %H:%M:%S"))
            cat = Category.query.filter(Category.category_id==user_score.category_id).first()
            if cat is not None:
                categories.append(cat.name)
            else:
                categories.append('None')
        user_score_avg = db.session.query(db.func.avg(Scores.score).label('average')).filter(Scores.user_id==user.user_id).group_by(Scores.category_id).all()
        user_score_avg = [round(user_score[0], 2) for user_score in user_score_avg]
        user_score_category = db.session.query(Scores.category_id).filter(Scores.user_id==user.user_id).group_by(Scores.category_id).all()
        user_score_category = [user_score[0] for user_score in user_score_category]
        user_score_last = db.session.query(db.func.max(Scores.datetime)).filter(Scores.user_id==user.user_id).group_by(Scores.category_id).all()
        user_score_last = [date_time[0].strftime("%b %d %Y %H:%M:%S") for date_time in user_score_last]

        category_ = []
        category = Category.query.all()
        for cat in category:
            dictionary = cat.__dict__
            if dictionary["category_id"] in user_score_category:
                dictionary["avg_score"] = round(user_score_avg[user_score_category.index(dictionary["category_id"])]*10, 2)

                dictionary["last_score"] = user_score_last[user_score_category.index(dictionary["category_id"])]
            else:
                dictionary["avg_score"] = None
                dictionary["last_score"] = None    
            dictionary.pop("_sa_instance_state")
            category_.append(dictionary)

        s = {}
        s["scores"] = scores
        s["datetimes"] = datetimes
        s["categories"] = categories
        return jsonify(username=user.name, scores=s, category=category_)#, leaderboard=leaders)

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = Users.query.filter(Users.user_id == user_id).first()
        password = request.json.get("password", None)
        user.password = generate_password_hash(password)
        db.session.commit()
        return {"msg":"Edit Successful"}, 200

    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        scores = Scores.query.filter(Scores.user_id == user_id).all()
        for score in scores:
            db.session.delete(score)
        user = Users.query.filter(Users.user_id == user_id).first()
        db.session.delete(user)
        db.session.commit()
        return {"msg":"Delete Successful"}, 200
   
class ScoreAPI(Resource):
    @jwt_required()
    def get(self):
        category = Category.query.all()
        keys = ["Name", "Score", "Date"]
        leaders = {}
        for cat in category:
            leader = db.session.query(Users.name, Scores.score, Scores.datetime).filter(db.and_(Users.user_id == Scores.user_id, Scores.category_id==cat.category_id, Category.category_id==Scores.category_id)).order_by(Scores.score.desc(), Scores.datetime.desc()).all()
            leader = [dict(zip(keys, name)) for name in leader]
            for l in leader:
                l["Date"] = l["Date"].strftime("%b %d %Y %H:%M:%S")
            if len(leader) == 0:
                leader = [dict(zip(keys, [None, None, None]))]
            leaders[cat.name]= leader
        return jsonify(leaderboard=leaders)

    @jwt_required()
    def post(self):
        category_id = request.json.get("category_id", None)
        score = request.json.get("score", None)
        current_user = get_jwt_identity()
        user = Users.query.filter(Users.user_id == current_user).first()
        result = {}
        result["user_id"] = current_user
        result["category_id"] = category_id
        result["score"] = score
        result["datetime"] = datetime.utcnow()
        score = Scores(**result)
        db.session.add(score)
        db.session.commit()
        return {"msg":"Scores stored successfully!"}

card_resource_fields = {
    'card_id': fields.Integer,
    'category_id': fields.Integer,
    'front': fields.String,
    'answer': fields.Integer,
    'option_1': fields.String,
    'option_2': fields.String,
    'option_3': fields.String,
    'option_4': fields.String,
}

class DownloadAPI(Resource):
    @jwt_required()
    def post(self):
        category_id = request.json.get("category_id", None)
        allcards=[]
        cards = Cards.query.filter(Cards.category_id == category_id).all()
        if len(cards) == 0:
            return {"msg":"No cards in the deck!"}, 404
        for i, card in enumerate(cards):
            temp = {}
            temp["card_id"] = card.card_id
            temp["front"] = card.front
            temp["option_1"] = card.option_1
            temp["option_2"] = card.option_2
            temp["option_3"] = card.option_3
            temp["option_4"] = card.option_4
            temp["correct_ans"] = card.answer
            allcards.append(temp)
        return jsonify(allcards=allcards)

class allCardsAPI(Resource):
    @jwt_required()
    def get(self, category_id):
        category = Category.query.filter(Category.category_id == category_id).first()
        if category is not None:
            cards = Cards.query.filter(Cards.category_id == category_id).all()
            shuffle(cards)
            card_ids = []
            if len(cards) > 10:
                cards = cards[:10]
            for card in cards:
                card_ids.append(card.card_id)
            return jsonify(title=category.name, description=category.description,card_ids=card_ids)
        else:
            return {"msg": "Invalid Category"}, 404
    @jwt_required()
    def post(self):
        answers = request.json.get("answers", None)
        card_ids = request.json.get("card_ids", None)
        category_id = request.json.get("category_id", None)
        if category_id is None:
            allcards = {}
            for i, id in enumerate(card_ids):
                temp = {}
                card = Cards.query.filter(Cards.card_id == id).first()
                temp["front"] = card.front
                temp["option_1"] = card.option_1
                temp["option_2"] = card.option_2
                temp["option_3"] = card.option_3
                temp["option_4"] = card.option_4
                temp["correct_ans"] = card.answer
                if str(i) not in answers.keys():
                    temp["given_ans"] = 0
                else:
                    temp["given_ans"] = int(answers[str(i)])
                allcards[i] = temp
        else:
            allcards={}
            cards = Cards.query.filter(Cards.category_id == category_id).all()
            for i, card in enumerate(cards):
                temp = {}
                temp["card_id"] = card.card_id
                temp["front"] = card.front
                temp["option_1"] = card.option_1
                temp["option_2"] = card.option_2
                temp["option_3"] = card.option_3
                temp["option_4"] = card.option_4
                temp["correct_ans"] = card.answer
                allcards[i] = temp
        return allcards

class CardAPI(Resource):
    @jwt_required()
    @marshal_with(card_resource_fields)
    def get(self, card_id):
        card = Cards.query.filter(Cards.card_id==int(card_id)).first()
        if card is None:
            raise NotFoundError(status_code=404)
        return card

    @jwt_required()
    def post(self):
        category_id = request.json.get("category_id", None)
        front = request.json.get("front", None)
        answer = request.json.get("answer", None)
        option_1 = request.json.get("option_1", None)
        option_2 = request.json.get("option_2", None)
        option_3 = request.json.get("option_3", None)
        option_4 = request.json.get("option_4", None)
        card = Cards(front=front, category_id=int(category_id), answer = int(answer), option_1=option_1, option_2=option_2, option_3=option_3, option_4=option_4)
        db.session.add(card)
        db.session.commit()
        return {"msg": "Created Successfully!"}, 200

    @jwt_required()
    def put(self, card_id):
        card = Cards.query.filter(Cards.card_id==card_id).first()
        front = request.json.get("front", None)
        answer = request.json.get("answer", None)
        option_1 = request.json.get("option_1", None)
        option_2 = request.json.get("option_2", None)
        option_3 = request.json.get("option_3", None)
        option_4 = request.json.get("option_4", None)
        card.front = front
        card.answer = int(answer)
        card.option_1 = option_1
        card.option_2 = option_2
        card.option_3 = option_3
        card.option_4 = option_4

        db.session.commit()

        return {"msg":"Edit Successful"}, 200

    @jwt_required()
    def delete(self, card_id):
        card = Cards.query.filter(Cards.card_id == int(card_id)).first()
        db.session.delete(card)
        db.session.commit()
        return {"msg":"Delete Successful"}, 200

deck_resource_fields = {
    'category_id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
}

class DeckAPI(Resource):
    @jwt_required()
    def get(self, category_id):
        category = Category.query.filter(Category.category_id == category_id).first()
        return jsonify(name=category.name, description=category.description)

    @marshal_with(deck_resource_fields)
    def put(self, category_id):
        name = request.json.get("name", None)
        description = request.json.get("description", None)
        
        category = Category.query.filter(Category.category_id==category_id).first()
        category.name = name
        category.description = description

        db.session.commit()

        return category
    
    @jwt_required()
    def post(self):
        name = request.json.get("name", None)
        description = request.json.get("description", None)
        category = Category(name=name, description=description)
        db.session.add(category)
        db.session.commit()
        return {"msg": "Created Successfully"}, 200

    @jwt_required()
    def delete(self, category_id):
        category = Category.query.filter(Category.category_id==category_id).first()
        cards = Cards.query.filter(Cards.category_id == category_id).all()
        for card in cards:
            db.session.delete(card)
        scores = Scores.query.filter(Scores.category_id == category_id).all()
        for score in scores:
            db.session.delete(score)
        db.session.delete(category)
        db.session.commit()
        return {"msg": "Delete Successfull"}, 200


