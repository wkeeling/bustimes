from flask import (Flask,
                   json,
                   send_file,
                   send_from_directory,
                   request,
                   Response)

from flask.ext.cache import Cache

from server.eta import etas
from server.stops import StopService


app = Flask(__name__)
app.debug = True
cache = Cache(app, config={'CACHE_TYPE': 'simple',
                           'CACHE_THRESHOLD': 1000})

stop_service = StopService()


@app.route('/')
@app.route('/buses')
@app.route('/share')
@app.route('/feedback')
@app.route('/about')
def index():
    return send_file('templates/index.html')


@app.route('/api/stops', methods=['GET'])
def stops():
    if 'id' not in request.args:
        raise RuntimeError('No id specified')
    
    id_ = request.args['id']
    position = None

    if 'position' in request.args:
        lat, lon = request.args['position'].split(',')
        position = float(lat), float(lon)

    selected_stops = stop_service.get_stops((int(i) for i in id_.split(',')),
                                            position)
    return Response(json.dumps(selected_stops), mimetype='application/json')


@app.route('/api/stops/nearest', methods=['GET'])
def stops_nearest():
    if 'position' not in request.args:
        raise RuntimeError('No position specified')

    lat, lon = request.args['position'].split(',')

    nearest = stop_service.get_stops_nearest((lat, lon))
    
    return Response(json.dumps(nearest),  mimetype='application/json')


@app.route('/api/stops/matching', methods=['GET'])
def stops_matching():
    if 'text' not in request.args:
        raise RuntimeError('No text specified')
    
    position = None
    if 'position' in request.args:
        lat, lon = request.args['position'].split(',')
        position = float(lat), float(lon)

    matching = stop_service.get_stops_matching(request.args['text'], position)
    
    return Response(json.dumps(matching),  mimetype='application/json')


@app.route('/api/stop/distance', methods=['GET'])
def stop_distance():
    if 'position' not in request.args:
        raise RuntimeError('No position specified')
    if 'id' not in request.args:
        raise RuntimeError('No id specified')

    lat, lon = request.args['position'].split(',')
    position = float(lat), float(lon)

    distance = stop_service.get_stop_distance(int(request.args['id']),
                                              position)

    return Response(json.dumps(distance),  mimetype='application/json')


@app.route('/api/etas', methods=['GET'])
@cache.cached(timeout=30, 
              key_prefix=lambda: request.args.get('stopids', ''),
              unless=lambda: request.args.get('no_cache') is not None)
def etas():
    if 'stopids' not in request.args:
        raise RuntimeError('No stopids specified')
    
    stopids = request.args['stopids']
    bus_etas = etas(stopids.split(','))
    
    return Response(json.dumps(bus_etas),  mimetype='application/json')


@app.route('/touch-icon-152x152.png')
@app.route('/touch-icon-120x120.png')
@app.route('/touch-icon-76x76.png')
@app.route('/touch-icon-60x60.png')
@app.route('/startup.png')
@app.route('/favicon.ico')
def static_from_root():
    return send_from_directory(app.static_folder,
                               'assets/img/' + request.path[1:])

