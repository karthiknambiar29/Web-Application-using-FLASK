from re import sub
import time
from application.workers import celery
from datetime import datetime
from flask import current_app as app
from celery.schedules import crontab
from application.sendmail import format_message, send_mail
from application.database import db
from application.models import Users, Scores, Category, Cards
import json
from urllib.parse import quote
import requests
from json import dumps

@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(crontab(day_of_month="28", hour=14, minute=50), monthly_mail.s(), name='Monthly Report')
    sender.add_periodic_task(crontab(hour=14, minute=48), daily_mail.s(), name='Daily Reminder')
    sender.add_periodic_task(crontab(hour=14, minute=48), daily_reminder.s(), name='Daily Google Chat Reminder')
    pass

@celery.task()
def daily_reminder():
    """Hangouts Chat incoming webhook quickstart."""
    url = 'https://chat.googleapis.com/v1/spaces/AAAA4khtA88/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=LDWub0-OSWCmzOcW_dvli9bX1NgGzPD8AZkJ1BcDPlQ%3D'
    bot_message = {
        'text' : 'Reminder to complete your daily dose of Flashcards!'}

    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    x = requests.post(url, json=bot_message, headers=message_headers)

@celery.task()
def daily_mail():
    users = Users.query.all()
    category = Category.query.all()
    categories = []
    for cat in category:
        categories.append(cat.name)
    for user in users:
        data = {}
        data["username"] = user.name
        data["categories"] = categories
        user_score_last = db.session.query(db.func.max(Scores.datetime)).filter(Scores.user_id==user.user_id).group_by(Scores.category_id).all()
        user_score_last = [date_time[0].strftime("%b %d %Y") for date_time in user_score_last]
        if datetime.today().strftime('%b %d %Y') not in user_score_last:
            message = format_message("templates/daily_mail.html", data=data)
            send_mail(to_address=user.email, subject="Daily Reminder", message=message)

@celery.task()
def monthly_mail():
    users = Users.query.all()
    for user in users:
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
            category_.append(dictionary)

        s = {}
        s["scores"] = scores[:7]
        s["datetimes"] = datetimes[:7]
        s["categories"] = categories[:7]

        data = {}
        data["username"] = user.name
        data["scores"] = s
        data["category"] = category_
        message = format_message("templates/monthly_mail.html", data=data)

        send_mail(to_address=user.email, subject="Monthly Report", message=message)

