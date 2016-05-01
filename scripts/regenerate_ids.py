import json
import os

cur_dir = os.path.dirname(__file__)
stops_dir = os.path.join(cur_dir, '..', 'app', 'server', 'stops')

with open(os.path.join(stops_dir, 'data.json')) as inp:
    stops = json.load(inp)
    count = 1

    for stop in stops:
        stop['id'] = count
        count += 1

with open(os.path.join(stops_dir, 'data.json'), 'w') as out:
    json.dump(stops, out, indent=4)

print('Stop ids regenerated (%s)' % count)
