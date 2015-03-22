'''
Created on 22 Mar 2015

@author: will
'''
import os
from mock import patch, Mock

from app.server.eta.eta import eta_requestor


class TestOxonTimeEtaRequestor(object):
    
    @patch('app.server.eta.eta.requests')
    def test_should_return_etas_for_single_shortcode(self, mock_requests):
        def get_side_effect(url):
            with open(os.path.join(os.path.dirname(__file__), 
                                                'oxontime_resp_1.xhtml')) as f:  
                mock_resp = Mock()
                mock_resp.text = f.read()
                return mock_resp
        
        mock_requests.get.side_effect = get_side_effect
        
        shortcodes = ['69327525']
        
        etas = eta_requestor.get_etas(shortcodes)
        
        assert len(etas) == 10
        assert etas[0]['service'] == '300'
        assert etas[0]['dest'] == 'Redbridge P&R'
        assert etas[0]['time'] == '6 mins'   
        assert etas[9]['service'] == 'S3'
        assert etas[9]['dest'] == 'Rail Station'
        assert etas[9]['time'] == '74 mins'  
    
    @patch('app.server.eta.eta.requests')
    def test_should_return_etas_for_multiple_shortcodes(self, mock_requests):
        def get_side_effect(url):
            filename = 'oxontime_resp_1.xhtml'
            if url.find('69327527') > -1:
                filename = 'oxontime_resp_2.xhtml'
            with open(os.path.join(os.path.dirname(__file__), filename)) as f:  
                mock_resp = Mock()
                mock_resp.text = f.read()
                return mock_resp
        
        mock_requests.get.side_effect = get_side_effect
        
        shortcodes = ['69327525', '69327527']
        
        etas = eta_requestor.get_etas(shortcodes)
        
        assert len(etas) == 12        
        assert etas[0]['service'] == 'S3'
        assert etas[0]['dest'] == 'Oxford'
        assert etas[0]['time'] == 'DUE'
        assert etas[1]['service'] == '300'
        assert etas[1]['dest'] == 'Redbridge P&R'
        assert etas[1]['time'] == '6 mins'     
        assert etas[5]['service'] == 'S3'
        assert etas[5]['dest'] == 'Oxford'
        assert etas[5]['time'] == '34 mins'  
        
    @patch('app.server.eta.eta.requests')
    def test_should_return_empty_list_when_no_etas(self, mock_requests):
        def get_side_effect(url):
            with open(os.path.join(os.path.dirname(__file__), 
                                                'oxontime_resp_3.xhtml')) as f:  
                mock_resp = Mock()
                mock_resp.text = f.read()
                return mock_resp
        
        mock_requests.get.side_effect = get_side_effect
        
        shortcodes = ['69327525']
        
        etas = eta_requestor.get_etas(shortcodes)
        
        assert len(etas) == 0        
