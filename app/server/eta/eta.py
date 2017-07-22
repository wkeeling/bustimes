from StringIO import StringIO

from lxml import etree
import requests


_OXON_TIME_URL = 'http://www.buscms.com/api/REST/html/departureboard.aspx' \
                 '?callback=c&clientid=Nimbus&stopid={}&' \
                 'format=jsonp&sourcetype=siri'


def etas(stopids):
    """
    Get the bus etas for the specified list of stopids.

    Note that 'stopids' in this context refers to the 'stopids' property in
    the JSON data, not the surrogate 'id' of a stop.

    :param stopids:
        A list of stopids.
    :return:
        A list of dicts, each dict representing the eta of a bus. Each
        dict has 3 items: 'service', 'dest' and 'time'.
    """
    data = []

    for stopid in stopids:
        resp = requests.get(_OXON_TIME_URL.format(stopid))
        data += _parse(resp.text)

    def time_key(eta):
        time = eta['time']
        if 'mins' in time:
            return int(time[:len(time)-4])
        return 0

    data.sort(key=lambda eta: eta['dest'])
    data.sort(key=time_key)

    return data


def _parse(html):
    results = []
    parser = etree.HTMLParser()
    html = html[4:-3]  # Strip off leading and trailing jsonp characters
    html = html.replace('\\', '')  # Strip out backslashed attribute quotes
    root = etree.parse(StringIO(html), parser)

    for row in root.xpath('//tr[@class="rowServiceDeparture"]'):
        if len(row) == 3:
            eta = dict(service=row[0].text.split()[0].strip(),
                       dest=row[1].text.strip(),
                       time=row[2].text.strip())
            results.append(eta)

    return results
