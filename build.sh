NODE_ENV=production webpack --config webpack.prod.js
gzip -9 public/bundle.js
node-sass public/styles/sass -o public/styles --output-style compressed
