'''
Created on 21 Mar 2015

@author: will
'''
from app.server.stops.stops import StopService


class TestStopService(object):
    
    def setup_method(self, method):
        self._service = StopService()
    
    def test_should_get_stop_by_id(self):
        stop = self._service.get_stop(1)
        assert stop is not None
        
        stop = self._service.get_stop('foobar')
        assert stop is None