'''
Created on 21 Mar 2015

@author: will
'''
from app.server.stops import stop_service
import time

def setup_module(module):
    stop_service.initialise()


class TestStopService(object):
    
    def test_should_get_stop_by_id(self):
        stop = stop_service.get_stop(1)
        assert stop is not None
        
        stop = stop_service.get_stop('foobar')
        assert stop is None
        
    def test_should_match_stop(self):
        stops = stop_service.get_matching_stops('CorNISh ROAD')
        assert len(stops) == 1
        assert stops[0]['id'] == 1
        
        stops = stop_service.get_matching_stops('woodSTOCK')
        assert len(stops) == 4
        
        stops = stop_service.get_matching_stops('foobar')
        assert len(stops) == 0
        
    def test_should_get_stops_nearest(self):
        position = {'latitude': 51.853771, 'longitude': -1.359258}
        before = time.time()
        nearest_stops = stop_service.get_stops_nearest(position)
        after = time.time()
        print('Finding nearest stops took {m} secs'.format(m=(after-before)))
        
        assert len(nearest_stops) == 3
        assert nearest_stops[0]['name'] == 'Vermont Drive'
        assert nearest_stops[1]['name'] == 'Hill Rise'
        assert nearest_stops[2]['name'] == 'Marlborough Arms'