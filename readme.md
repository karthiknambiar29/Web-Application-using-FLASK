# Local Setup
- Clone the project
- Run `local_setup.sh`

# Local Development Run
- `local_run.sh` It will start the flask app in `development`. Suited for local development

# Replit run
- Go to shell and run
    `pip install --upgrade poetry`
- On the shell run
    `pip install -r requirements.txt`
- On the shell run
    `python3 main.py`
- Or click on `main.py` and click button run....

# Folder Structure

- `db_directory` has the sqlite DB. It can be anywhere on the machine. Adjust the path in ``application/config.py`. Repo ships with one required for testing.
- `application` is where our application code is
- `local_setup.sh` set up the virtualenv inside a local `.env` folder. Uses `pyproject.toml` and `poetry` to setup the project
- `local_run.sh`  Used to run the flask application in development mode
- `static` - default `static` files folder. It serves at '/static' path. 
- `static/bootstrap` We have already added the bootstrap files so it can be used
- `static/style.css` Custom CSS. You can edit it. Its empty currently
- `templates` - Default flask templates folder
- `api_docs.yaml` - OpenAPI Documentation



```
├── api_docs.yaml
├── application
│   ├── api.py
│   ├── config.py
│   ├── controllers.py
│   ├── database.py
│   ├── __init__.py
│   ├── models.py
│   └── validation.py
├── db_directory
│   └── flashcards.sqlite3
├── local_run.sh
├── local_setup.sh
├── main.py
├── readme.md
├── requirements.txt
├── static
│   ├── bootstrap
│   │   ├── css
│   │   │   ├── bootstrap.css
│   │   │   ├── bootstrap.css.map
│   │   │   ├── bootstrap-grid.css
│   │   │   ├── bootstrap-grid.css.map
│   │   │   ├── bootstrap-grid.min.css
│   │   │   ├── bootstrap-grid.min.css.map
│   │   │   ├── bootstrap-grid.rtl.css
│   │   │   ├── bootstrap-grid.rtl.css.map
│   │   │   ├── bootstrap-grid.rtl.min.css
│   │   │   ├── bootstrap-grid.rtl.min.css.map
│   │   │   ├── bootstrap.min.css
│   │   │   ├── bootstrap.min.css.map
│   │   │   ├── bootstrap-reboot.css
│   │   │   ├── bootstrap-reboot.css.map
│   │   │   ├── bootstrap-reboot.min.css
│   │   │   ├── bootstrap-reboot.min.css.map
│   │   │   ├── bootstrap-reboot.rtl.css
│   │   │   ├── bootstrap-reboot.rtl.css.map
│   │   │   ├── bootstrap-reboot.rtl.min.css
│   │   │   ├── bootstrap-reboot.rtl.min.css.map
│   │   │   ├── bootstrap.rtl.css
│   │   │   ├── bootstrap.rtl.css.map
│   │   │   ├── bootstrap.rtl.min.css
│   │   │   ├── bootstrap.rtl.min.css.map
│   │   │   ├── bootstrap-utilities.css
│   │   │   ├── bootstrap-utilities.css.map
│   │   │   ├── bootstrap-utilities.min.css
│   │   │   ├── bootstrap-utilities.min.css.map
│   │   │   ├── bootstrap-utilities.rtl.css
│   │   │   ├── bootstrap-utilities.rtl.css.map
│   │   │   ├── bootstrap-utilities.rtl.min.css
│   │   │   └── bootstrap-utilities.rtl.min.css.map
│   │   └── js
│   │       ├── bootstrap.bundle.js
│   │       ├── bootstrap.bundle.js.map
│   │       ├── bootstrap.bundle.min.js
│   │       ├── bootstrap.bundle.min.js.map
│   │       ├── bootstrap.esm.js
│   │       ├── bootstrap.esm.js.map
│   │       ├── bootstrap.esm.min.js
│   │       ├── bootstrap.esm.min.js.map
│   │       ├── bootstrap.js
│   │       ├── bootstrap.js.map
│   │       ├── bootstrap.min.js
│   │       └── bootstrap.min.js.map
│   ├── favicon.png
│   ├── images
│   │   └── avatar.png
│   ├── js
│   │   └── custom.js
│   └── style.css
└── templates
    ├── add_card.html
    ├── add_deck.html
    ├── answers.html
    ├── cards.html
    ├── dashboard.html
    ├── decks.html
    ├── home.html
    ├── login.html
    ├── register.html
    ├── score.html
    ├── show_cards.html
    ├── start.html
    ├── template.html
    ├── update_card.html
    ├── update_deck.html
    └── update_user.html

9 directories, 78 files
```
