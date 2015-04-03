'''
Created on 21 Mar 2015

@author: will
'''
from flask import Flask
from flask import send_file
from flask import request
from flask import Response
from flask import json
from flask import send_from_directory

from .server.stops import stop_service
from .server.eta import eta_requestor


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
    
    _id = request.args['id']
    position = None
    if 'position' in request.args:
        position = [float(p) for p in request.args['position'].split(',')]
        
    stops = stop_service.get_stops([int(i) for i in _id.split(',')], position)
    
    return Response(json.dumps(stops),  mimetype='application/json')

@app.route('/api/stop/nearest', methods=['GET'])
def stops_nearest():
    if not 'position' in request.args:
        raise RuntimeError('No position specified')
    
    nearest = stop_service.get_stops_nearest([float(p) 
                                 for p in request.args['position'].split(',')])
    
    return Response(json.dumps(nearest),  mimetype='application/json')

@app.route('/api/stop/matching', methods=['GET'])
def stops_matching():
    if not 'text' in request.args:
        raise RuntimeError('No text specified')
    
    position = None
    if 'position' in request.args:
        position = [float(p) for p in request.args['position'].split(',')]
        
    matching = stop_service.get_stops_matching(request.args['text'], position)
    
    return Response(json.dumps(matching),  mimetype='application/json')

@app.route('/api/stop/distance', methods=['GET'])
def stop_distance():
    if not 'position' in request.args:
        raise RuntimeError('No position specified')
    if not 'stop_id' in request.args:
        raise RuntimeError('No stop_id specified')
    
    distance = stop_service.get_stop_distance([float(p) 
                                 for p in request.args['position'].split(',')], 
                                              int(request.args['stop_id']))
    
    return Response(json.dumps(distance),  mimetype='application/json')

@app.route('/api/eta', methods=['GET'])
def eta():
    if not 'stopcodes' in request.args:
        raise RuntimeError('No stopcodes specified')
    
    stopcodes = request.args['stopcodes']
    etas = eta_requestor.get_etas([s for s in stopcodes.split(',')])
    
    return Response(json.dumps(etas),  mimetype='application/json')

@app.route('/bus-icon-144x144.png')
@app.route('/bus-icon-114x114.png')
@app.route('/bus-icon-72x72.png')
@app.route('/bus-icon-57x57.png')
@app.route('/bus-icon-32x32.png')
def static_from_root():
    return send_from_directory(app.static_folder, 'assets/img/' + request.path[1:])