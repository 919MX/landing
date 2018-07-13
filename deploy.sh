set -e

# `aws` command depends on credentials in `~/.aws` directory
./build.sh
./data.sh

bucketname='brigada.mx'

aws s3 cp public/bundle.js.gz s3://${bucketname}/bundle.js --acl public-read --cache-control max-age=3600 --content-encoding gzip
aws s3 cp public/index.html s3://${bucketname} --acl public-read
aws s3 cp public/error.html s3://${bucketname} --acl public-read

aws s3 cp public/nosotros s3://${bucketname} --acl public-read --content-type "text/html"
aws s3 cp public/privacidad s3://${bucketname} --acl public-read --content-type "text/html"
aws s3 cp public/terminos s3://${bucketname} --acl public-read --content-type "text/html"

aws s3 cp public/livechat.js s3://${bucketname} --acl public-read
aws s3 cp public/styles/global.css s3://${bucketname}/styles/ --acl public-read
aws s3 sync public/assets s3://${bucketname}/assets --acl public-read

aws s3 cp public/robots.txt s3://${bucketname} --acl public-read
