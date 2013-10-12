# coding: utf-8
import os
import logging

from flask import Flask
from feedsocket import handle_feedsocket
from flask_sockets import Sockets

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.debug = True
sockets = Sockets(app)

@sockets.route('/feeds')
def feed_socket(ws):
    handle_feedsocket(ws) 

import views

