import time

from app.server.stops import StopService


class TestStopService(object):

    def setup_method(self, method):
        self._stop_service = StopService()
    
    def test_should_get_stop_by_id(self):
        stops = self._stop_service.get_stops([1])
        assert len(stops) == 1
        
        stops = self._stop_service.get_stops(['foobar'])
        assert len(stops) == 0
        
        stops = self._stop_service.get_stops([1, 2])
        assert len(stops) == 2     
        
    def test_should_get_stop_by_id_adding_distance(self):
        latitude = 51.853771 
        longitude = -1.359258
        stops = self._stop_service.get_stops([1],
                                             position=[latitude, longitude])
        assert len(stops) == 1
        assert 'distance' in stops[0]
        
    def test_should_get_stops_matching(self):
        stops = self._stop_service.get_stops_matching('CorNISh')
        assert len(stops) == 1
        assert stops[0]['id'] == 1
        
        stops = self._stop_service.get_stops_matching('OLD woodSTOCK')
        assert len(stops) == 3
        assert stops[0]['matched_name'] == 'Farm End - Old Woodstock'
        assert stops[2]['matched_name'] == 'Vermont Drive - Old Woodstock'
        
        stops = self._stop_service.get_stops_matching('foobar')
        assert len(stops) == 0
        
    def test_should_get_stops_matching_adding_distance(self):
        latitude = 51.853771 
        longitude = -1.359258
        stops = self._stop_service.get_stops_matching('CorNISh ROAD',
                                                      position=[latitude,
                                                                longitude])
        assert len(stops) == 1
        assert stops[0]['id'] == 1
        assert 'distance' in stops[0]
        
    def test_should_get_stops_nearest(self):
        latitude = 51.853771 
        longitude = -1.359258
        before = time.time()
        nearest_stops = self._stop_service.get_stops_nearest(
            [latitude, longitude])
        after = time.time()
        print('Finding nearest stops took {m} ms'.format(
            m=((after - before) * 1000)))
        
        assert len(nearest_stops) == 4
        assert nearest_stops[0]['name'] == 'Vermont Drive'
        assert 'distance' in nearest_stops[0]
        assert nearest_stops[1]['name'] == 'Farm End'
        assert 'distance' in nearest_stops[1]
        assert nearest_stops[2]['name'] == 'Hill Rise'
        assert 'distance' in nearest_stops[2]        
        assert nearest_stops[3]['name'] == 'Marlborough Grill'
        assert 'distance' in nearest_stops[3]
        
    def test_should_get_stops_nearest_radcliffe_infirmary(self):
        latitude = 51.760725 
        longitude = -1.262044
        nearest_stops = self._stop_service.get_stops_nearest(
            [latitude, longitude])
        
        assert nearest_stops[0]['name'] == 'Radcliffe Infirmary'

    def test_should_get_stop_distance(self):
        latitude = 51.853771 
        longitude = -1.359258
        distance = self._stop_service.get_stop_distance(13,
                                                        [latitude, longitude])
        
        assert distance['distance'] == 0.26055808442875256
