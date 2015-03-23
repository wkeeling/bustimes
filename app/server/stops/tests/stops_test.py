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
        stops = stop_service.get_stops([1])
        assert len(stops) == 1
        
        stops = stop_service.get_stops(['foobar'])
        assert len(stops) == 0
        
        stops = stop_service.get_stops([1,2])
        assert len(stops) == 2     
        
    def test_should_get_stops_matching(self):
        stops = stop_service.get_stops_matching('CorNISh ROAD')
        assert len(stops) == 1
        assert stops[0]['id'] == 1
        
        stops = stop_service.get_stops_matching('woodSTOCK')
        assert len(stops) == 4
        assert stops[0]['matched_name'] == 'Blenheim Palace - Woodstock'
        assert stops[3]['matched_name'] == 'Vermont Drive - Old Woodstock'
        
        stops = stop_service.get_stops_matching('foobar')
        assert len(stops) == 0
        
    def test_should_get_stops_nearest(self):
        latitude = 51.853771 
        longitude = -1.359258
        before = time.time()
        nearest_stops = stop_service.get_stops_nearest(latitude, longitude)
        after = time.time()
        print('Finding nearest stops took {m} secs'.format(m=(after-before)))
        
        assert len(nearest_stops) == 3
        assert nearest_stops[0]['name'] == 'Vermont Drive'
        assert nearest_stops[1]['name'] == 'Hill Rise'
        assert nearest_stops[2]['name'] == 'Marlborough Arms'