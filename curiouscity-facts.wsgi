activate_this = '/home/ubuntu/.virtenvs/curiouscity-facts/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys, logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/srv/curiouscity-facts')

from app import app as application
application.debug = True