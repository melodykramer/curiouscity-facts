activate_this = '/home/ubuntu/.virtenvs/curiouscity-facts/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0, '/srv/curiouscity-facts')

from curiouscity-facts import app as application