import os
from flask import Flask
from flask_restful import Resource, Api
from application import config
from application.config import LocalDevelopmentConfig
from application.database import db
from application import workers

app = None
api = None
celery = None

def create_app():
    app = Flask(__name__, template_folder="templates")
    if os.getenv('ENV', "development") == "production":
      raise Exception("Currently no production config is setup.")
    else:
      print("Staring Local Development")
      app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api = Api(app)
    app.app_context().push()  

    celery = workers.celery

    celery.conf.update(
      broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"]
    )
    celery.Task = workers.ContextTask
    app.app_context().push()
    return app, api, celery

app, api, celery = create_app()


from application.controllers import *


from application.api import DownloadAPI, EmailAPI, RegisterAPI, ScoreAPI, UserAPI, CardAPI, DeckAPI, allCardsAPI
api.add_resource(UserAPI, "/api/user", "/api/user/<string:username>")
api.add_resource(CardAPI, "/api/card","/api/card/<int:card_id>")
api.add_resource(DeckAPI, "/api/deck", "/api/deck/<int:category_id>")
api.add_resource(ScoreAPI, "/api/score")
api.add_resource(allCardsAPI, "/api/allcards", "/api/allcards/<int:category_id>")
api.add_resource(RegisterAPI, "/api/register")
api.add_resource(EmailAPI, "/api/mail")
api.add_resource(DownloadAPI, "/api/download")
if __name__ == '__main__':
  app.run(host="127.0.0.1",port=8080)
