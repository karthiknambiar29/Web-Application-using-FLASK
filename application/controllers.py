from flask import Flask, request, redirect, url_for
from flask import render_template
from flask import current_app as app
from application.models import Cards, Category, Users, Scores
from application.database import db
from datetime import datetime as dt
from flask import json, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, JWTManager
jwt = JWTManager(app)

@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("index.html")
