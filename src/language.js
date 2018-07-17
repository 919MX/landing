import { localStorage } from 'src/storage'


export const getLanguage = async () => {
  const l = window.navigator.language.split('-')[0].toLowerCase()
  if (l === 'es') return 'es'

  const ssc = ['ar', 'bo', 'cl', 'co', 'cr', 'cu', 'do', 'ec', 'sv',
    'gq', 'gt', 'hn', 'mx', 'ni', 'pa', 'py', 'pe', 'es', 'uy', 've']

  const r = await fetch('https://ipinfo.io/json')
  const data = await r.json()
  if (ssc.includes(data.country.toLowerCase())) return 'es'

  return 'en'
}
