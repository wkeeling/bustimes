import os
from mock import patch, Mock

from app.server.eta import etas


@patch('app.server.eta.eta.requests')
def test_get_etas_for_single_stopid(mock_requests):
    def get_side_effect(url):
        with open(os.path.join(os.path.dirname(__file__),
                               'oxontime_resp_1.txt')) as f:
            mock_resp = Mock()
            mock_resp.text = f.read()
            return mock_resp

    mock_requests.get.side_effect = get_side_effect

    stopids = ['100894']

    data = etas(stopids)

    assert len(data) == 3
    assert data[0]['service'] == 'X40'
    assert data[0]['dest'] == 'City Centre'
    assert data[0]['time'] == '16:29'
    assert data[1]['service'] == '31'
    assert data[1]['dest'] == 'City Centre'
    assert data[1]['time'] == '42 mins'


@patch('app.server.eta.eta.requests')
def test_get_etas_for_multiple_stopids(mock_requests):
    def get_side_effect(url):
        filename = 'oxontime_resp_2.txt'
        if '104080' in url:
            filename = 'oxontime_resp_3.txt'
        with open(os.path.join(os.path.dirname(__file__), filename)) as f:
            mock_resp = Mock()
            mock_resp.text = f.read()
            return mock_resp

    mock_requests.get.side_effect = get_side_effect

    stopids = ['104158', '104080']

    data = etas(stopids)

    assert len(data) == 4
    assert data[0]['service'] == '31'
    assert data[0]['dest'] == 'Oxford'
    assert data[0]['time'] == '18:30'
    assert data[1]['service'] == '31'
    assert data[1]['dest'] == 'Wantage'
    assert data[1]['time'] == '4 mins'
    assert data[2]['service'] == '31'
    assert data[2]['dest'] == 'Oxford'
    assert data[2]['time'] == '28 mins'
    assert data[3]['service'] == '31'
    assert data[3]['dest'] == 'Wantage'
    assert data[3]['time'] == '64 mins'


@patch('app.server.eta.eta.requests')
def test_get_empty_list_when_no_etas(mock_requests):
    def get_side_effect(url):
        with open(os.path.join(os.path.dirname(__file__),
                               'oxontime_resp_4.txt')) as f:
            mock_resp = Mock()
            mock_resp.text = f.read()
            return mock_resp

    mock_requests.get.side_effect = get_side_effect

    stopids = ['100644']

    data = etas(stopids)

    assert len(data) == 0
