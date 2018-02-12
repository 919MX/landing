./build.sh

scp -i ~/.ssh/919mx public/styles/global.css custom@52.37.92.55:/var/www/919/web/styles/global.css

scp -i ~/.ssh/919mx -r public/index.html custom@52.37.92.55:/var/www/919/web
scp -i ~/.ssh/919mx -r public/assets custom@52.37.92.55:/var/www/919/web
