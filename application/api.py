from datetime import date, datetime
from os import access
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




get_user_parser = reqparse.RequestParser()
get_user_parser.add_argument('name')

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument('name')
create_user_parser.add_argument('password')

update_user_parser = reqparse.RequestParser()
update_user_parser.add_argument('password')

delete_user_pasrser = reqparse.RequestParser()
delete_user_pasrser.add_argument('name')
delete_user_pasrser.add_argument('password')

resource_fields = {
    'user_id': fields.Integer,
    'name': fields.String,
    'password': fields.String
}

class UserAPI(Resource):

    def post(self):
        username = request.json.get('name', None) 
        password = request.json.get('password', None)
        user = Users.query.filter(Users.name==username).first()
        if user is None:
            raise NotFoundError(status_code=404)
        # return user
        access_token = create_access_token(identity=user.user_id)
        return jsonify(access_token=access_token)
    
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = Users.query.filter(Users.user_id == current_user).first()
        
        user_scores = Scores.query.filter(Scores.user_id == user.user_id).all()
        category = Category.query.all()
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
        print(user_score_avg, user_score_category, user_score_last)
        s = {}
        s["scores"] = scores
        s["datetimes"] = datetimes
        s["categories"] = categories
        # s = json.dumps(s)
        return jsonify(username=user.name, scores=s)

    # @marshal_with(resource_fields)
    # def put(self, username):
    #     args = update_user_parser.parse_args()
    #     password = args.get("password", None)
    #     user = Users.query.filter(Users.name == username).first()
        
        
    #     if user is None:
    #         raise NotFoundError(status_code=404)

    #     if password is None or password == "":
    #         raise NewUserError(status_code=400, error_code='U1002', error_message="password is required")

    #     user.password = password
    #     db.session.commit()
    #     return user

    # @marshal_with(resource_fields)
    # def post(self):
    #     args = create_user_parser.parse_args()
    #     username = args.get("name", None)
    #     password = args.get("password", None)

    #     if username is None or username == "":
    #         raise NewUserError(status_code=400, error_code='U1001', error_message="username is required")

    #     if password is None or password == "" or len(password) < 6:
    #         raise NewUserError(status_code=400, error_code='U1002', error_message="password is required")

    #     user = Users.query.filter(Users.name == username).first()

    #     if user:
    #         raise NewUserError(status_code=400, error_code='U1003', error_message="Duplicate User")
        
    #     new_user = Users(name=username, password=password)

    #     db.session.add(new_user)
    #     db.session.commit()
    #     return new_user

    # def delete(self):
    #     args = delete_user_pasrser.parse_args()
    #     username = args.get("name", None)
    #     password = args.get("password", None)

    #     if username is None:
    #         raise NewUserError(status_code=400, error_code='U1001', error_message="username is required")

    #     if password is None:
    #         raise NewUserError(status_code=400, error_code='U1002', error_message="password is required")

    #     user = Users.query.filter(db.and_(Users.name == username, Users.password==password)).first()

    #     if user is None:
    #         raise NotFoundError(status_code=404)

    #     scores = Scores.query.filter(Scores.user_id==user.user_id).all()
    #     for score in scores:
    #         db.session.delete(score)
    #     db.session.delete(user)
    #     db.session.commit()
    #     raise NotFoundError(status_code=200)

update_card_parser = reqparse.RequestParser()
update_card_parser.add_argument('category_id')
update_card_parser.add_argument('front')
update_card_parser.add_argument('answer')
update_card_parser.add_argument('option_1')
update_card_parser.add_argument('option_2')
update_card_parser.add_argument('option_3')
update_card_parser.add_argument('option_4')

create_card_parser = reqparse.RequestParser()
create_card_parser.add_argument('category_id')
create_card_parser.add_argument('front')
create_card_parser.add_argument('answer')
create_card_parser.add_argument('option_1')
create_card_parser.add_argument('option_2')
create_card_parser.add_argument('option_3')
create_card_parser.add_argument('option_4')

delete_card_parser = reqparse.RequestParser()
delete_card_parser.add_argument('card_id')


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


class CardAPI(Resource):
    @marshal_with(card_resource_fields)
    def get(self, card_id):
        card = Cards.query.filter(Cards.card_id==int(card_id)).first()
        if card is None:
            raise NotFoundError(status_code=404)
        return card

    @marshal_with(card_resource_fields)
    def put(self, card_id):
        args = update_card_parser.parse_args()
        card = Cards.query.filter(Cards.card_id==card_id).first()
        if card is None:
            raise NotFoundError(status_code=404)
        category_id = args.get("category_id", None)
        front = args.get("front", None)
        answer = args.get("answer", None)
        option_1 = args.get("option_1", None)
        option_2 = args.get("option_2", None)
        option_3 = args.get("option_3", None)
        option_4 = args.get("option_4", None)

        if category_id is None or not category_id.isdigit():
            raise NewUserError(status_code=400, error_code='C1001', error_message="Invalid Category Id")

        category = Category.query.filter(Category.category_id==int(category_id)).first()
        if category is None:
            raise NewUserError(status_code=400, error_code='C1001', error_message="Invalid Category Id")

        if front is None or answer is None or not answer.isdigit() or  option_1 is None or option_2 is None or option_3 is None or option_4 is None or front == "" or answer == "" or option_1 == "" or option_2 == "" or option_3 == "" or option_4 == "":
            raise NewUserError(status_code=400, error_code='C1002', error_message="Invalid Card Details")

        if int(answer) > 4 or int(answer) < 1 :
            raise NewUserError(status_code=400, error_code='C1003', error_message="Answer Invalid")

        card.category_id = int(category_id)
        card.front = front
        card.answer = int(answer)
        card.option_1 = option_1
        card.option_2 = option_2
        card.option_3 = option_3
        card.option_4 = option_4

        db.session.commit()

        return card

    @marshal_with(card_resource_fields)
    def post(self):
        args = create_card_parser.parse_args()
        category_id = args.get('category_id', None)
        front = args.get("front", None)
        answer = args.get("answer", None)
        option_1 = args.get("option_1", None)
        option_2 = args.get("option_2", None)
        option_3 = args.get("option_3", None)
        option_4 = args.get("option_4", None)

        if category_id is None or not category_id.isdigit():
            raise NewUserError(status_code=400, error_code='C1001', error_message="Invalid Category Id")        

        category = Category.query.filter(Category.category_id==int(category_id)).first()
        print('a')
        if category is None:
            raise NotFoundError(status_code=404)

        if front is None or answer is None or option_1 is None or option_2 is None or option_3 is None or option_4 is None or front == "" or answer == "" or option_1 == "" or option_2 == "" or option_3 == "" or option_4 == "":
            raise NewUserError(status_code=400, error_code='C1002', error_message="Invalid Card Details")        

        if int(answer) > 4 or int(answer) < 1:
            raise NewUserError(status_code=400, error_code='C1004', error_message="Answer not betweeen 1 and 4")

        card = Cards(front=front, category_id=int(category_id), answer = int(answer), option_1=option_1, option_2=option_2, option_3=option_3, option_4=option_4)
        db.session.add(card)
        db.session.commit()
        return card

    def delete(self):
        args = delete_card_parser.parse_args()
        card_id = args.get('card_id', None)

        if card_id is None or not card_id.isdigit():
            raise NewUserError(status_code=400, error_code='C1005', error_message="card_id not valid")

        card = Cards.query.filter(Cards.card_id==int(card_id)).first()
        
        if card is None:
            raise NotFoundError(status_code=404)

        db.session.delete(card)
        db.session.commit()
        raise NotFoundError(status_code=200)


deck_resource_fields = {
    'category_id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
}

update_deck_parser = reqparse.RequestParser()
update_deck_parser.add_argument('name')
update_deck_parser.add_argument('description')

create_deck_parser = reqparse.RequestParser()
create_deck_parser.add_argument('name')
create_deck_parser.add_argument('description')

delete_deck_parser = reqparse.RequestParser()
delete_deck_parser.add_argument('category_id')

class DeckAPI(Resource):
    @marshal_with(deck_resource_fields)
    def get(self, category_id):
        category = Category.query.filter(Category.category_id==category_id).first()
        if category is None:
            raise NotFoundError(status_code=404)
        return category

    @marshal_with(deck_resource_fields)
    def put(self, category_id):
        args = update_deck_parser.parse_args()
        name = args.get("name", None)
        description = args.get("description", None)
        
        category = Category.query.filter(Category.category_id==category_id).first()
        if category is None:
            raise NotFoundError(status_code=404)
   
        if name is None or name == "" or description is None or description == "":
            raise NewUserError(status_code=400, error_code='D1001', error_message="Invalid Input")

        category.name = name
        category.description = description

        db.session.commit()

        return category

    @marshal_with(deck_resource_fields)
    def post(self):
        args = create_deck_parser.parse_args()
        name = args.get("name", None)
        description = args.get("description", None)
        if name is None or name == "" or description is None or description == "":
            raise NewUserError(status_code=400, error_code='D1001', error_message="Invalid Input")

        category = Category(name=name, description=description)
        db.session.add(category)
        db.session.commit()
        return category

    def delete(self):
        args = delete_deck_parser.parse_args()
        category_id = args.get('category_id', None)

        if category_id is None or not category_id.isdigit():
            raise NewUserError(status_code=400, error_code='D1002', error_message="category_id not valid")

        category = Category.query.filter(Category.category_id==category_id).first()
        if category is None:
            raise NotFoundError(status_code=404)

        
        db.session.delete(category)
        db.session.commit()
        raise NotFoundError(status_code=200)



