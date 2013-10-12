#!/usr/bin/env python

#
# This file may be used instead of Apache mod_wsgi to run your python
# web application in a different framework.  A few examples are
# provided (cherrypi, gevent), but this file may be altered to run
# whatever framework is desired - or a completely customized service.
#
import imp
import os

try:
   zvirtenv = os.path.join(os.environ['OPENSHIFT_PYTHON_DIR'],
                           'virtenv', 'bin', 'activate_this.py')
   execfile(zvirtenv, dict(__file__ = zvirtenv) )
except IOError:
   pass

#
# IMPORTANT: Put any additional includes below this line.  If placed above this
# line, it's possible required libraries won't be in your searchable path
#
import logging
from gunicorn.app.base import Application
from app import app
     
class GunicornServer(Application):
    def __init__(self, options={}):
        self.usage = None
        self.prog = None
        self.callable = None 
        self.options = options
        self.do_load_config()

    def init(self, *args):
        cfg = {}
        for k, v in self.options.items(): 
            if k.lower() in self.cfg.settings and v is not None: 
                cfg[k.lower()] = v
        return cfg
    
    def load(self):
        from app import app
        return app 

#  main():
#
if __name__ == '__main__':
    ip   = os.environ['OPENSHIFT_PYTHON_IP']
    port = int(os.environ['OPENSHIFT_PYTHON_PORT'])
    options = {
        'bind': ip + ':' + str(port),
        'worker_class' : 'flask_sockets.worker',
        'workers' : '4'
    }
    GunicornServer(options).run()
