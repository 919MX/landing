const env = process.env.NODE_ENV === 'development' ? require('./env.dev') : require('./env.prod')

const common = {
  mapbox: {
    accessToken: 'pk.eyJ1Ijoia3lsZWJlYmFrIiwiYSI6ImNqOTV2emYzdjIxbXEyd3A2Ynd2d2s0dG4ifQ.W9vKUEkm1KtmR66z_dhixA',
    style: 'mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk',
  },
}

export default { ...common, ...env }
