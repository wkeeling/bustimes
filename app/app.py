'''
Created on 21 Mar 2015

@author: will
'''
from flask import Flask
from flask import send_file
from flask import jsonify
from flask import request
from flask import Response
from flask import json
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
    
    if stop:
        return jsonify(**stop)
    return jsonify({})

@app.route('/api/stop/nearest', methods=['GET'])
def nearest_stops():
    if not 'lat' in request.args:
        raise RuntimeError('No latitude specified')
    if not 'lon' in request.args:
        raise RuntimeError('No longitude specified')    
    
    nearest = stop_service.get_stops_nearest(float(request.args['lat']), float(request.args['lon']))
    
    return Response(json.dumps(nearest),  mimetype='application/json')

@app.route('/api/stop/matching', methods=['GET'])
def matching_stops():
    if not 'text' in request.args:
        raise RuntimeError('No text specified')
    
    matching = stop_service.get_matching_stops(request.args['text'])
    
    return Response(json.dumps(matching),  mimetype='application/json')