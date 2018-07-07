import gzip
import json
import sys

import requests


data_file_path = sys.argv[1]
# base_url = 'https://api.brigada.mx/api'
base_url = 'http://localhost:8000/api'

paths = [
    ('metrics', '/landing_metrics/'),
    ('localities', '/localities_with_actions/'),
    ('opportunities', '/volunteer_opportunities_cached/?transparency_level__gte=2'),
    ('actions', '/actions_cached/?level__gte=2&fields=id,locality,organization,donations,action_type,target,unit_of_measurement'),
]
data = {}

for key, path in paths:
    r = requests.get(f'{base_url}{path}')
    r.raise_for_status()
    data[key] = r.json()

print(f'writing compressed landing page data to {data_file_path}')
with gzip.open(data_file_path, 'wb') as f:
    f.write(bytes(json.dumps(data), 'utf-8'))
