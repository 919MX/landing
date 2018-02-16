# `aws` command depends on credentials in `~/.aws` directory
./build.sh
bucketname='ensintonia.org'

aws s3 cp public/index.html s3://${bucketname} --acl public-read
aws s3 cp public/error.html s3://${bucketname} --acl public-read
aws s3 cp public/nosotros s3://${bucketname} --acl public-read --content-type "text/html"
aws s3 cp public/styles/global.css s3://${bucketname}/styles/ --acl public-read
aws s3 sync public/assets s3://${bucketname}/assets --acl public-read
