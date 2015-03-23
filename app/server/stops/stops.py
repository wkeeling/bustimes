'''
Created on 21 Mar 2015

@author: will
'''
import os
import json
import math
import copy


class StopService(object):
    
    # The json file holding the stop data 
    _JSON_FILE = 'data.json'
    
    # For nearest stops, don't return stops over 1km away
    _MAX_DISTANCE = 1
    # For nearest stops, return more than 5 stops
    _MAX_NEAREST_STOPS = 5
    
    def __init__(self):
        self._stops = {}
        
    def initialise(self):
        self._stops.update(self._load_stops())
        print('Loaded {s} stops'.format(s=len(self._stops)))
    
    def _load_stops(self):
        with open(os.path.join(os.path.dirname(__file__), 
                                                        self._JSON_FILE)) as f:
            data = json.load(f)
            ret = {}
            for stop in data['stops']:
                if stop['id'] in ret:
                    raise RuntimeError('Duplicate stop id: ' + stop['id'])
                ret[stop['id']] = stop
            return ret
    
    def get_stops(self, ids):
        stops = [self._stops[_id] for _id in self._stops.keys() if _id in ids]
    
    def get_stops_matching(self, free_text):
        """Searches for the free_text substring in the stop name and 
        town/village to find out whether the stop matches. Adds the property
        'matched_name' to the returned stop object which is a concatenation of
        the stop name followed by a ' - ' followed by the town/village. The 
        list of matched stops are ordered alphabetically by matched_name
        
        """
        free_text = free_text.lower()
        matching = []
        for stop in self._stops.values():
            if (stop['name'].lower().find(free_text) > -1 or 
                            stop['town/village'].lower().find(free_text) > -1):
                stop['matched_name'] = '{s} - {t}'.format(s=stop['name'],
                                                      t=stop['town/village'])
                matching.append(stop)
        
        return sorted(matching, key=lambda s: s['matched_name'])
    
    def get_stops_nearest(self, lat, lon):
        """Finds the stops nearest the specified latitude and longitude. Stops
        will be returned that are within 1km of the specified position up to
        a maximum of 5 stops. The returned list will contain the stops in 
        increasing order of distance from the specified position. Each stop
        will have an attribute 'distance' specifying its distance in km.
        
        """
        nearest = []
        for stop in self._stops.values():
            dist = self._get_dist_in_km(lat, lon, 
                    stop['position']['latitude'], stop['position']['longitude'])
            if dist <= self._MAX_DISTANCE:
                stop = copy.deepcopy(stop)
                stop['distance'] = dist
                nearest.append(stop)
                if len(nearest) == self._MAX_NEAREST_STOPS:
                    break
        return sorted(nearest, key=lambda s: s['distance'])
    
    def _get_dist_in_km(self, lat1, lon1, lat2, lon2):
        radius = 6371 # Radius of the Earth in km
        d_lat = self._deg_to_rad(lat2 - lat1);
        d_lon = self._deg_to_rad(lon2 - lon1);
        a = (math.sin(d_lat / 2) * math.sin(d_lat / 2) + 
                        math.cos(self._deg_to_rad(lat1)) * 
                        math.cos(self._deg_to_rad(lat2)) * 
                        math.sin(d_lon / 2) * math.sin(d_lon / 2));
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
        distance_in_km = radius * c;   
        return distance_in_km     
    
    def _deg_to_rad(self, deg):
        return deg * (math.pi / 180)


stop_service = StopService()