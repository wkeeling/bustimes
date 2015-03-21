'''
Created on 21 Mar 2015

@author: will
'''
import os
import json


class StopService(object):
    
    _JSON_FILE = 'data.json'
    
    def __init__(self):
        self._stops = self._load_stops()
    
    def _load_stops(self):
        with open(os.path.join(os.path.dirname(__file__), self._JSON_FILE)) as f:
            data = json.load(f)
            ret = {}
            for stop in data['stops']:
                if stop['id'] in ret:
                    raise RuntimeError('Duplicate stop id: ' + stop['id'])
                ret[stop['id']] = stop
            return ret
        
    def get_stop(self, _id):
        return self._stops.get(_id)
    
    def get_matching_stops(self, free_text):
        pass
    
    def get_stops_nearest(self, position):
        pass
