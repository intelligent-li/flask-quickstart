# coding: utf-8
from flask import render_template
from flask import Response
from app import app
from apifeed import handle_request

@app.route('/')
def index():
        return render_template('index.html')

@app.route('/api/v1/feeds')
def api():
    return Response(response=handle_request('/api/v1/feeds'),
        status=200,
        headers={ 'Access-Control-Allow-Origin': '*'},
        mimetype='application/json',
        content_type=None, direct_passthrough=False)

@app.route('/api/v1/feeds/<guid>')
def feed(guid):
    return Response(response=handle_request("/api/v1/feeds/{0}".format(guid)),
        status=200,
        headers={ 'Access-Control-Allow-Origin': '*'},
        mimetype='application/json',
        content_type=None, direct_passthrough=False)

@app.route('/api/v1/feeds/<guid>/tags')
def tags(guid):
    return Response(response=handle_request("/api/v1/feeds/{0}/tags".format(guid)),
        status=200,
        headers={ 'Access-Control-Allow-Origin': '*'},
        mimetype='application/json',
        content_type=None, direct_passthrough=False)

@app.route('/api/v1/feeds/<guid>/location')
def location(guid):
    return Response(response=handle_request("/api/v1/feeds/{0}/location".format(guid)),
        status=200,
        headers={ 'Access-Control-Allow-Origin': '*'},
        mimetype='application/json',
        content_type=None, direct_passthrough=False)

@app.route('/api/v1/feeds/<guid>/samples')
def samples(guid):
    return Response(response=handle_request("/api/v1/feeds/{0}/samples".format(guid)),
        status=200,
        headers={ 'Access-Control-Allow-Origin': '*'},
        mimetype='application/json',
        content_type=None, direct_passthrough=False)
    
