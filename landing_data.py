import gzip
import json
import sys

import requests


data_file_path = sys.argv[1]

r = requests.get('https://api.brigada.mx/api/landing/')
r.raise_for_status()

print(f'writing compressed landing page data to {data_file_path}')
with gzip.open(data_file_path, 'wb') as f:
    f.write(bytes(json.dumps(r.json()), 'utf-8'))
