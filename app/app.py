'''
Created on 21 Mar 2015

@author: will
'''
from flask import Flask
from flask import send_file
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
    
    arg = request.args['id']
    stops = stop_service.get_stops([int(i) for i in arg.split(',')])
    
    return Response(json.dumps(stops),  mimetype='application/json')

@app.route('/api/stop/nearest', methods=['GET'])
def stops_nearest():
    if not 'lat' in request.args:
        raise RuntimeError('No latitude specified')
    if not 'lon' in request.args:
        raise RuntimeError('No longitude specified')    
    
    nearest = stop_service.get_stops_nearest(float(request.args['lat']), float(request.args['lon']))
    
    return Response(json.dumps(nearest),  mimetype='application/json')

@app.route('/api/stop/matching', methods=['GET'])
def stops_matching():
    if not 'text' in request.args:
        raise RuntimeError('No text specified')
    
    matching = stop_service.get_stops_matching(request.args['text'])
    
    return Response(json.dumps(matching),  mimetype='application/json')