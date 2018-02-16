# Sintonía landing page


## Development
`npm install`, then `npm run dev`. Then open `index.html` in your browser.


## Deploy
`npm run deploy`: because it's entirely static, our landing page [is hosted by S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html). Deployment uploads necessary static files to the bucket that serves the site.

The site is hosted [here](http://ensintonia.org.s3-website-us-west-2.amazonaws.com/). Route 53 DNS ensures <http://ensintonia.org> and <http://www.ensintonia.org> point to this URL.
