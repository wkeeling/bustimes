import argparse
import json
import os
import sys

import requests


def update_json(args):
    with open(args.input, 'r') as inp:
        stops = json.load(inp)

    for stop in stops:
        for code in stop['stopcodes']:
            resp = requests.get(
                'http://www.buscms.com/api/rest/ent/stop.aspx?'
                'callback=c&clientid=Nimbus&method=searchexact'
                '&format=jsonp&q=%s&_=1459698430478' % code)
            result = json.loads(resp.text[2:-2])['result']

            if result:
                print('Successful: %s (%s)' % (stop['name'], code))
                if len(result) > 1:
                    print('Stop %s has more than one stop id' % code)
                if 'stopids' not in stop:
                    stop['stopids'] = []
                stopid = result[0]['stopId']
                if stopid not in stop['stopids']:
                    stop['stopids'].append(stopid)
            else:
                print('Data missing: %s (%s)' % (stop['name'], code))

    with open(args.output, 'w') as out:
        json.dump(stops, out, indent=4)


def main():
    parser = argparse.ArgumentParser(description='Update the JSON data with '
                                                 'the OXON Time stopids')

    cur_dir = os.path.dirname(__file__)
    stops_dir = os.path.join(cur_dir, '..', 'app', 'server', 'stops')

    parser.add_argument('-i', action='store', dest='input',
                        default=os.path.join(stops_dir, 'data.json'))
    parser.add_argument('-o', action='store', dest='output',
                        default=os.path.join(stops_dir, 'data.json'))

    args = parser.parse_args(sys.argv[1:])

    update_json(args)


if __name__ == '__main__':
    main()
