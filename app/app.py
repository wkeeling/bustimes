'''
Created on 21 Mar 2015

@author: will
'''
from flask import Flask
from flask import send_file
from flask import jsonify
from flask import request
from .server.stops import stop_service


app = Flask(__name__)
app.debug = True

stop_service.initialise()


@app.route('/')
def index():
    return send_file('templates/index.html')

@app.route('/api/stop', methods=['GET'])
def stop():
    if not 'id' in request.args:
        raise RuntimeError('No stop id specified')
    
    stop = stop_service.get_stop(int(request.args['id']))
    
    return jsonify(**stop)

@app.route('/api/stop/nearest', methods=['POST'])
def nearest_stops():
    if not 'position' in request.form:
        raise RuntimeError('No position specified')
    
    nearest = stop_service.get_stops_nearest(request.form['position'])
    
    return jsonify(**nearest)

@app.route('/api/stop/matching', methods=['POST'])
def matching_stops():
    if not 'text' in request.form:
        raise RuntimeError('No text specified')
    
    matching = stop_service.get_matching_stops(request.form['text'])
    
    return jsonify(**matching)