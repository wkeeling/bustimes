import copy
import json
import math
import os


class StopService(object):
    
    # The json file holding the stop data 
    _JSON_FILE = 'data.json'
    
    # For nearest stops, don't return stops over 1km away
    _MAX_DISTANCE = 1
    # For nearest stops, don't return more than 5 stops
    _MAX_NEAREST_STOPS = 5
    
    def __init__(self):
        self._stops = self._load_stops()
        print('Loaded {s} stops'.format(s=len(self._stops)))

    def _load_stops(self):
        stops = {}

        with open(
                os.path.join(os.path.dirname(__file__), self._JSON_FILE)) as f:
            data = json.load(f)

            for stop in data:
                stop_id = stop['id']
                if stop_id in stops:
                    raise RuntimeError(
                        'Duplicate stop id: {}'.format(stop_id))
                stops[stop_id] = stop

            return stops
    
    def get_stops(self, ids, position=None):
        """
        Get list of stops (dicts) for a specified iterator of stop ids.
        If the position argument is supplied (a two element sequence holding
        the latitude and longitude of the current position) then the distance
        in km will be added to each returned stop under the property
        'distance'.
        :param ids:
            An iterator of stop ids.
        :param position:
            Optional two element sequence holding the latitude and longitude,
            both floats.
        :return:
            An list of stops (dicts).
        """
        stops = []

        for id_ in ids:
            try:
                stop = copy.deepcopy(self._stops[id_])
            except KeyError:
                pass
            else:
                if position:
                    stop['distance'] = self._get_stop_distance(stop, position)
                stops.append(stop)

        return stops

    def get_stops_matching(self, text, position=None):
        """Search for stops that contain the specified text in their name
        and/or town/village property. For stops that match, a property
        'matched_name' is added to the returned stop object which
        is a concatenation of the stop name followed by a ' - ' followed
        by the town/village. The list of matched stops are ordered
        alphabetically by matched_name. If the position argument is supplied
        (a two element list containing the latitude and longitude of the
        current position) then the distance in km will be added to each
        returned stop under the property 'distance'.
        :param text:
            The substring to search for.
        :param position:
            Optional two element sequence holding the latitude and longitude,
            both floats.
        :return:
            A list of stops (dicts) or an empty list if no stops match.
        """
        text = text.lower()
        matching = []

        for stop in self._stops.values():
            stop_name = stop['name'].lower()
            town = stop['town/village'].lower()

            if text in stop_name or text in town:
                stop = copy.deepcopy(stop)
                stop['matched_name'] = '{name} - {town/village}'.format(**stop)

                if position:
                    stop['distance'] = self._get_stop_distance(stop, position)
                    
                matching.append(stop)
        
        return sorted(matching, key=lambda s: s['matched_name'])
    
    def get_stops_nearest(self, position):
        """Find the stops nearest the specified position - a two element
        sequence holding the latitude and longitude. Stops will be returned
        that are within 1km of the specified position up to a maximum of 5
        stops. The returned list will contain the stops in increasing order
        of distance from the specified position. Each stop will have an
        property 'distance' specifying its distance in km.
        :param position:
            Two element sequence holding the latitude and longitude of
            the current position, both floats.
        :return:
            A list of stops (dicts) or an empty list if no stops match.
        """
        nearest = []

        for stop in self._stops.values():
            dist = self._get_stop_distance(stop, position)

            if dist <= self._MAX_DISTANCE:
                stop = copy.deepcopy(stop)
                stop['distance'] = dist
                nearest.append(stop)

        nearest = sorted(nearest, key=lambda s: s['distance'])

        return nearest[:self._MAX_NEAREST_STOPS]
    
    def get_stop_distance(self, id_, position):
        """
        Get the distance of a stop in km from the supplied position.
        :param id_:
            The id of the stop.
        :param position:
            A two element sequence holding the latitude and longitude of
            the current position, both floats.
        :return:
            The distance of the stop in km.
        """
        stop = self._stops[id_]
        return {'distance': self._get_stop_distance(stop, position)}
    
    def _get_stop_distance(self, stop, position):
        return self._get_dist_in_km(position[0], position[1],
                                    stop['position']['latitude'],
                                    stop['position']['longitude'])
    
    def _get_dist_in_km(self, lat1, lon1, lat2, lon2):
        radius = 6371  # Radius of the Earth in km
        d_lat = self._deg_to_rad(lat2 - lat1)
        d_lon = self._deg_to_rad(lon2 - lon1)
        a = (math.sin(d_lat / 2) * math.sin(d_lat / 2) +
             math.cos(self._deg_to_rad(lat1)) *
             math.cos(self._deg_to_rad(lat2)) *
             math.sin(d_lon / 2) * math.sin(d_lon / 2))
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance_in_km = radius * c

        return distance_in_km     
    
    def _deg_to_rad(self, deg):
        return deg * (math.pi / 180)

