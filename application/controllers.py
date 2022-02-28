from flask import Flask, request, redirect, url_for
from flask import render_template
from flask import current_app as app
from application.models import Cards, Category, Users, Scores
from application.database import db
from datetime import datetime as dt
from flask import json


@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("home.html")
@app.route("/login_2", methods=["GET", "POST"])
def login_2():
    if request.method == "POST":
        return None
    
    return render_template("login_2.html")
# Route for handling the login page logic
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        login_request_username = request.form['username']
        login_request_password = request.form['password']

        # check the database for username and corresponding password
        user = Users.query.filter(db.and_(Users.name == login_request_username, Users.password == login_request_password)).first()
        # if username and password is correct
        if user != None:
            return redirect(url_for('user', username=login_request_username))
        else:
            # if username or password is incorrect
            error = True
            return render_template('login.html', error = error)

    return render_template('login.html', error=error)

# route for handling the registration of new users
@app.route("/register", methods=["GET", "POST"])
def register():
    username_error = False
    password_error=False
    password_not_valid = False

    if request.method == 'POST':
        login_request_username = request.form['username']
        login_request_password = request.form['password']
        login_request_confirm_password = request.form['confirm_password']

        # check if username already exists
        user = Users.query.filter(Users.name == login_request_username).first()

        if user != None:    # username exists
            username_error = True
            if len(login_request_password) < 6:
                password_not_valid = True
                return render_template("register.html", username_error=username_error, password_error=password_error, password_not_valid=password_not_valid)
            elif login_request_password != login_request_confirm_password:    # password confirmation fails
                password_error = True
                return render_template("register.html", username_error=username_error, password_error=password_error, password_not_valid=password_not_valid)
            else:   # password confirmation success
                password_error = False
                return render_template("register.html", username_error=username_error, password_error=password_error, password_not_valid=password_not_valid)
        else:   # username doesnot exits
            username_error = False
            if len(login_request_password) < 6:
                password_not_valid = True
                return render_template("register.html", username_error=username_error, password_error=password_error, password_not_valid=password_not_valid)
            elif login_request_password != login_request_confirm_password:    # password confirmation fails
                password_error = True
                return render_template("register.html", username_error=username_error, password_error=password_error, password_not_valid=password_not_valid)
            else:   # password confirmation success
                password_error = False
                new_user = Users(name=login_request_username, password=login_request_password)
                db.session.add(new_user)
                db.session.commit()
                return redirect(url_for('user', username=login_request_username))

    return render_template("register.html", password_error=password_error, username_error=username_error)

# route to handle successful login of user
@app.route("/<username>", methods=["GET", "POST"])
def user(username):
    users = Users.query.filter(Users.name == username).first()
    user_scores = Scores.query.filter(Scores.user_id == users.user_id).all()
    category = Category.query.all()
    scores = []
    datetimes = []
    categories = []
    for user_score in user_scores:
        scores.append(user_score.score)
        datetimes.append(user_score.datetime.strftime("%b %d %Y %H:%M:%S"))
        cat = Category.query.filter(Category.category_id==user_score.category_id).first()
        if cat is not None:
            categories.append('Category: ' + cat.name)
        else:
            categories.append('Category: None')

    user_score_avg = db.session.query(db.func.avg(Scores.score).label('average')).filter(Scores.user_id==users.user_id).group_by(Scores.category_id).all()
    user_score_avg = [round(user_score[0], 2) for user_score in user_score_avg]
    user_score_category = db.session.query(Scores.category_id).filter(Scores.user_id==users.user_id).group_by(Scores.category_id).all()
    user_score_category = [user_score[0] for user_score in user_score_category]
    user_score_last = db.session.query(db.func.max(Scores.datetime)).filter(Scores.user_id==users.user_id).group_by(Scores.category_id).all()
    user_score_last = [date_time[0].strftime("%b %d %Y %H:%M:%S") for date_time in user_score_last]

    #leaderboard
    leaders = []
    for cat in category:
        leader = db.session.query(Category.name, Users.name, Scores.score, Scores.datetime).filter(db.and_(Users.user_id == Scores.user_id, Scores.category_id==cat.category_id, Category.category_id==Scores.category_id)).order_by(Scores.score.desc(), Scores.datetime.desc()).all()
        leader = [list(name) for name in leader]
        for l in leader:
            l[3] = l[3].strftime("%b %d %Y %H:%M:%S")
        leaders.append(leader)

    return render_template('dashboard.html', user=users,scores = json.dumps(scores), datetimes = json.dumps(datetimes), categories = json.dumps(categories),
     category=category, user_score_category=user_score_category, user_score_avg=user_score_avg, user_score_last=user_score_last, leaders=leaders)

@app.route("/<username>/delete", methods=["GET", "POST"])
def delete_user(username):
    user = Users.query.filter(Users.name==username).first()
    scores = Scores.query.filter(Scores.user_id == user.user_id).all()
    for score in scores:
        db.session.delete(score)
    db.session.delete(user)
    db.session.commit()
    return redirect(url_for('home'))

@app.route("/<username>/update", methods=["GET", "POST"])
def update_user(username):
    password_error=False
    user = Users.query.filter(Users.name==username).first()
    if request.method == 'POST':
        user = Users.query.filter(Users.name==username).first()
        login_request_password = request.form['password']
        login_request_confirm_password = request.form['confirm_password']

        if user != None:    # username exists
            if login_request_password != login_request_confirm_password:    # password confirmation fails
                password_error = True
                return render_template("update_user.html",password_error=password_error)
            else:   # password confirmation success
                password_error = False
                user.password = login_request_password
                db.session.commit()
                return redirect(url_for('user', username=user.name))
        
    return render_template("update_user.html", username=username, password_error=password_error)

@app.route("/<username>/<int:category>")
def category(username, category):
    users = Users.query.filter(Users.name == username).first()
    category_data = Category.query.filter(Category.category_id==category).first()
    return render_template('start.html', user=users, category=category_data)

question_dict = {'user_id':None, 'category_id':None, 'q1':-2, 'q2':-2, 'q3':-2,
 'q4':-2, 'q5':-2, 'q6':-2, 'q7':-2, 'q8':-2, 'q9':-2, 'q10':-2 , 'score':0, 'datetime':None}

@app.route("/<username>/<int:category>/<int:question>", methods=["GET", "POST"])
def question(username, category, question):
    global question_dict
    users = Users.query.filter(Users.name == username).first()
    cards = Cards.query.filter(Cards.category_id == category).all()
    if request.method == 'POST':
        selected_option = request.form['check']
        if int(selected_option) == cards[question-1].answer:
            question_dict['q{}'.format(question)] = 1 # correct answer
        elif int(selected_option) == 0:
            question_dict['q{}'.format(question)] = 0 # no answer
        else:
            question_dict['q{}'.format(question)] = -1 # wrong answer
        return redirect(url_for('answer', username=username, category=category, question=question))
    if len(cards)==0:
        return redirect(url_for('create_card', username=users.name, category=category))
    if question > 10:
        question_dict['user_id'] = users.user_id
        question_dict['category_id'] = category
        question_dict['score'] = get_score(question_dict)[1]
        question_dict['datetime'] = dt.utcnow()
        score = Scores(**question_dict)
        db.session.add(score)
        db.session.commit()
        
        question_dict = {'user_id':None, 'category_id':None, 'q1':-2, 'q2':-2, 'q3':-2, 'q4':-2, 'q5':-2, 'q6':-2, 'q7':-2, 'q8':-2, 'q9':-2, 'q10':-2 , 'score':0, 'datetime':None}
        return redirect(url_for('score', username=username, category=category, score_id=score.score_id))
    return render_template('cards.html', username=username, category=category, q=question, user = users, card=cards[question-1])

@app.route("/<username>/<int:category>/<int:question>/ans", methods=["GET", "POST"])
def answer(username, category, question):
    users = Users.query.filter(Users.name == username).first()
    cards = Cards.query.filter(Cards.category_id == category).all()
    card = cards[question-1]
    answers = card.answer
    correct_option = card.__dict__['option_{}'.format(answers)]
    return render_template('answers.html', card=card, correct_option=correct_option, username=username, category=category, question=question)

@app.route("/<username>/<int:category>/score")
def score(username, category):
    score_id = request.args.get('score_id')
    score = Scores.query.filter(Scores.score_id==score_id).first()
    cards = Cards.query.filter(Cards.category_id==category).all()
    answers = []
    front = []
    back = []
    for card in cards:
        answers.append(card.answer)
        front.append(card.front)
        card_dict = card.__dict__
        back.append(card_dict['option_{}'.format(card.answer)])
    responses, correct_ans, wrong_ans, no_ans = get_score(score.__dict__)
    return render_template('score.html', username=username, responses=responses, correct_ans=json.dumps(correct_ans), wrong_ans=json.dumps(wrong_ans), no_ans=json.dumps(no_ans), answers=answers, front=front, back=back, cards=cards)

def get_score(question_dict):
    responses = []
    for i in range(1, 11):
        responses.append(question_dict['q' + str(i)])
    correct_ans = responses.count(1)
    wrong_ans = responses.count(-1)
    no_ans = responses.count(0)

    return responses, correct_ans, wrong_ans, no_ans
    
@app.route("/<username>/<int:category>/cards")
def cards(username, category):
    user =Users.query.filter(Users.name==username).first()
    cards = Cards.query.filter(Cards.category_id==category).all()
    answers = []
    front = []
    back = []
    options = []
    for card in cards:
        answers.append(card.answer)
        front.append(card.front)
        card_dict = card.__dict__
        options.append([card.option_1, card.option_2, card.option_3, card.option_4])
        back.append(card_dict['option_{}'.format(card.answer)])
    
    return render_template('show_cards.html', user=user, cards=cards, category=category, answers=answers, front=front, options=options)

@app.route("/<username>/create/<int:category>", methods=['GET', 'POST'])
def create_card(username, category):
    user = Users.query.filter(Users.name==username).first()
    if request.method == "POST":
        question = request.form['question']
        option_1 = request.form['option_1']
        option_2 = request.form['option_2']
        option_3 = request.form['option_3']
        option_4 = request.form['option_4']
        correct_ans = request.form['check']
        card = Cards(front=question, answer=int(correct_ans), category_id=category, option_1=option_1, option_2=option_2, option_3=option_3, option_4=option_4)
        db.session.add(card)
        db.session.commit()
        print(question, option_1, option_2, option_3, option_4, type(correct_ans))
        return redirect(url_for('cards', username=username, category=category))
    return render_template('add_card.html', user=user, category=category)

@app.route("/<username>/delete/card/<int:category>", methods=["GET", "POST"])
def delete_card(username, category):
    card_id = int(request.args.get('card_id'))
    card = Cards.query.filter(Cards.card_id==card_id).first()
    db.session.delete(card)
    db.session.commit()
    return redirect(url_for('cards', username=username, category=category))

@app.route("/<username>/update/card/<int:category>", methods=["GET", "POST"])
def update_card(username, category):
    card_id = int(request.args.get('card_id'))
    if request.method == "POST":
        card = Cards.query.filter(Cards.card_id == card_id).one()
        card.front = request.form['question']
        card.answer = int(request.form['check'])
        card.option_1 = request.form['option_1']
        card.option_2 = request.form['option_2']
        card.option_3 = request.form['option_3']
        card.option_4 = request.form['option_4']
        db.session.commit()
        return redirect(url_for('cards', username=username, category=category))
    return render_template('update_card.html', username=username, category=category)

@app.route("/<username>/decks")
def decks(username):
    category = Category.query.all()
    user = Users.query.filter(Users.name == username).first()
    return render_template('decks.html', user=user, category=category)

@app.route("/<username>/create", methods=["GET", "POST"])
def create_deck(username):
    if request.method=="POST":
        name = request.form['name']
        description = request.form['description']
        category = Category(name=name, description=description)
        db.session.add(category)
        db.session.commit()
        return redirect(url_for('cards', username=username, category=category.category_id))
    return render_template('add_deck.html', username=username)

@app.route("/<username>/delete/<int:category_id>")
def delete_deck(username, category_id):
    category = Category.query.filter(Category.category_id==category_id).first()
    cards = Cards.query.filter(Cards.category_id==category_id).all()
    scores = Scores.query.filter(Scores.category_id==category_id).all()
    for card in cards:
        db.session.delete(card)
    for score in scores:
        db.session.delete(score)
    db.session.delete(category)
    db.session.commit()
    return redirect(url_for('decks', username=username))

@app.route("/<username>/update/<int:category_id>", methods=["GET", "POST"])
def update_deck(username, category_id):
    if request.method == "POST":
        category = Category.query.filter(Category.category_id == category_id).first()
        category.name = request.form['name']
        category.description = request.form['description']
        db.session.commit()
        return redirect(url_for('cards', username=username, category=category_id))
    return render_template('update_deck.html')





