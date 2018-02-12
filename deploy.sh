# `aws` command depends on credentials in `~/.aws` directory
# aws s3 ls s3://719s.mx
./build.sh
bucketname='719s.mx'

aws s3 cp public/index.html s3://${bucketname} --acl public-read
aws s3 cp public/error.html s3://${bucketname} --acl public-read
aws s3 cp public/styles/global.css s3://${bucketname}/styles/ --acl public-read
aws s3 sync public/assets s3://${bucketname}/assets --acl public-read
