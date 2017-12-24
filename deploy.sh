./build.sh

scp -i ~/.ssh/919mx styles/global.css custom@52.37.92.55:/var/www/919/web/styles/global.css

scp -i ~/.ssh/919mx -r html custom@52.37.92.55:/var/www/919/web
scp -i ~/.ssh/919mx -r assets custom@52.37.92.55:/var/www/919/web
