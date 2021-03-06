# Curious City Fact Generator

The Curious City Fact Generator pulls a random fact from a Google Doc the team is keeping up (technically json based on that spreadsheet). The backend is a Flask app which powers a small API.

## Assumptions for local development
* You are running OSX.
* You are using Python 2.7. (Probably the version that came with OSX.)
* You have [virtualenv](https://pypi.python.org/pypi/virtualenv) and [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper) installed and working.

## How to install
Clone this repo to your local machine. We recommend starting a new python Virtual Environment using virtualenvwrapper (see above) for your project.

```
git clone git@github.com:wbez/curiouscity-facts.git
cd curiouscity-facts
mkvirtualenv curiouscity-facts --python=/usr/bin/python2.7
```

The virtual environment starts up automatically on creation, but to activate it in the future just use:

```
workon curiouscity-facts
```

Your new virtual environment comes with the pip python package manager. All libraries installed with the virtualenv active will be contained within the local environment and not available globally. This keeps different dependencies for different projects separate so there aren't any version conflicts.

The repo comes with a list of required libraries in requirements.txt. To install all of these, navigate to your project directory and run:

```
pip install -r requirements.txt
```
to get all the needed packages.

## How to start the app locally

From the terminal, run:

```
python run.py 
```

Then go to http://127.0.0.1:5000/ to see your shiny new app.

## Apache configuration

```
<VirtualHost *:80>
        ServerName your.host.name.net		# ccfacts.wbez.org
        DocumentRoot /path/to/dir/ 			# /srv/curiouscity-facts/
        WSGIScriptAlias / /path/to/wsgi		# /srv/curiouscity-facts/curiouscity-facts.wsgi
        <Directory /path/to/dir/>			# /srv/curiouscity-facts/
                Order allow,deny
                Allow from all
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/cc-facts-error.log
        LogLevel info
        CustomLog ${APACHE_LOG_DIR}/cc-facts-access.log combined
</VirtualHost>
```

## WSGI configuration
Put this in curiouscity-facts.wsgi in the app root
```
activate_this = '/home/ubuntu/.virtenvs/curiouscity-facts/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys, logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/srv/curiouscity-facts')

from app import app as application
```

## Where everything lives

The app itself lives in the appropriately titled app directory, which includes:
* data: Holds facts.json, which is used to populate the app
* static: Has project css and flowtype.js, used to resize the text on page resize,
* templates: All the page templates. Flask uses [jinja2](http://jinja.pocoo.org/).
	* base.html includes base head and script content and main page structure
	* index.html has the structure for main page design elements and the javascript that controls reloading the app. Eventually want to move that to its own .js file
	* facts.html and picture.html are templates to display the facts themselves and are specified in the Google Doc entry for each fact
	* social.html and footer.html are standing elements that are including in the main templates.
	* __init__.py initializes the app, loading Flask and calling views.py
	* views.py is the main logic for the app, including functions and url routes


