set -e

datafilepath='/tmp/landing_data.json.gz'

python3 landing_data.py $datafilepath

aws s3 cp $datafilepath s3://brigada.mx/landing_data.json --acl public-read --cache-control max-age=86400 --content-type application/json --content-encoding gzip
