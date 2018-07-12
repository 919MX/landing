NODE_ENV=production CUSTOM_GIT_COMMIT_HASH=`git rev-parse HEAD` webpack --config webpack.prod.js
node-sass public/styles/sass -o public/styles --output-style compressed
