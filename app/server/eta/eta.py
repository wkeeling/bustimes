'''
Created on 22 Mar 2015

@author: will
'''
import requests
from bs4 import BeautifulSoup


class OxonTimeEtaRequestor(object):
    
    _OXON_TIME_URL = 'http://www.oxontime.com/Naptan.aspx?t=departure&sa=%stopcode%&format=xhtml'
    
    def get_etas(self, stopcodes):
        etas = []
        for stopcode in stopcodes:
            html_resp = requests.get(self._OXON_TIME_URL.replace('%stopcode%', stopcode))
            etas += self._parse_out_etas(html_resp.text)
            
        def time_key(eta):
            time = eta['time']
            if 'mins' in time:
                return int(time[:len(time)-4])
            else:
                return 0
        
        etas.sort(key=lambda eta: eta['dest'])
        etas.sort(key=time_key)
        
        return etas
    
    def _parse_out_etas(self, html_resp):
        etas = []
        parsed = BeautifulSoup(html_resp)
        main_table = parsed.body.find('table', attrs={'class': 'selectable'})
        
        if main_table:
            rows = main_table.find('tbody').find_all('tr')
            for row in rows:
                cells = row.find_all('td')
                eta = {'service': cells[0].string,
                       'dest': cells[1].string,
                       'time': cells[2].string}
                etas.append(eta)
                
        return etas
    
    
eta_requestor = OxonTimeEtaRequestor()
