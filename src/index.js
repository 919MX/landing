import 'babel-polyfill'
import 'whatwg-fetch'

import env from 'src/env'


const fmtSpent = (b) => {
  return Math.round(b / 100000) / 10
}

const fmtBudget = (b) => { // round to 1 or 0 decimal places
  if (!b) return '$'
  const millions = Math.round(b / 100000) / 10
  if (millions >= 100) return `$${Math.round(millions)}M`
  if (millions) return `$${millions}M`

  const thousands = Math.round(b / 1000)
  return `$${thousands}K`
}

const scrollIntoView = (el, options) => {
  if (typeof el.scrollIntoView === 'function') {
    el.scrollIntoView(options)
    return true
  }
  return false
}

const dayOfYear = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}

const hash = (n) => {
  const s = String(n * 1000000)
  let hash = 0
  if (s.length == 0) {
    return hash
  }
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash // Convert to 32bit integer
  }
  const _hash = hash % 10000
  return Math.sign(_hash) * _hash
}

const rotatingHash = (n, days = 3) => {
  return hash(n + Math.floor(dayOfYear() / days))
}

const pluralize = (str) => {
  let plural

  const last = str[str.length - 1] // Last letter of str
  const lastTwo = str.slice(-2)
  const lastThree = str.slice(-3)

  if (last === 'x' || last === 's') {
    plural = str
  }
  else if (last === 'z') {
    // drop the z and add ces
    const radical = str.substring(0, str.length - 1)
    plural = radical + 'ces'
  }
  else if (last === 'c') {
    // drop the z and add ces
    const radical = str.substring(0, str.length - 1)
    plural = radical + 'ques'
  }
  else if (last === 'g') {
    // add an extra u
    plural = str + 'ues'
  }
  else if (last === 'a' || last === 'e' || last === 'é' || last === 'i' || last === 'o' || last === 'u') {
    // easy, just add s
    plural = str + 's'
  }
  else if (last === 'á') {
    const radical = str.substring(0, str.length - 1)
    plural = radical + 'aes'
  }
  else if (last === 'ó') {
    const radical = str.substring(0, str.length - 1)
    plural = radical + 'oes'
  }
  else if (lastThree === 'ión') {
    const radical = str.substring(0, str.length - 3)
    plural = radical + 'iones'
  }
  else if (lastTwo === 'ín') {
    const radical = str.substring(0, str.length - 2)
    plural = radical + 'ines'
  } else {
    plural = str + 'es'
  }
  return plural
}

const renderError = () => {}

const renderMetrics = ({ groups, actions, total_spent: spent }) => {
  const metricsStr = `Nos unimos para reconstruir México y para construir confianza. Acordamos trabajar de manera transparente. Somos ${groups} organizaciones gastando $${fmtSpent(spent)} millones de pesos en ${actions} proyectos de reconstrucción. Somos Brigada.`
  const _p = document.getElementById('brigada-metrics')
  _p.innerHTML = metricsStr
}

const renderMapHeader = ({ results }) => {
  const _h = document.getElementById('brigada-map-header')
  _h.innerHTML = `Al dia de hoy, estamos en ${results.length} comunidades`
}

const renderActions = ({ results }) => {
  const _container = document.getElementById('brigada-actions')

  const firstThree = (items) => {
    const _items = []

    for (const item of items) {
      if (_items.length === 0) {
        _items.push(item)
        continue
      }
      if (_items.length === 1 && _items[0].organization.id !== item.organization.id) {
        _items.push(item)
        continue
      }
      if (_items.length === 2 && _items[0].organization.id !== item.organization.id &&
        _items[1].organization.id !== item.organization.id) {
        _items.push(item)
        break
      }
    }

    if (_items.length === 1 && items.length > 1) _items.push(items[items.length - 1])
    if (_items.length === 2 && items.length > 2) _items.push(items[items.length - 2])

    const idx = _items.findIndex(v => v.donations.length > 0) // puts an action with donations in the middle
    if (idx >= 0 && _items.length > 1) {
      const temp = _items[idx]
      _items[idx] = _items[1]
      _items[1] = temp
    }
    return _items
  }

  const actions = results.filter((a) => {
    const { preview: { src } } = a
    if (!src) return false
    return true
  }).sort((a, b) => rotatingHash(a.id) - rotatingHash(b.id))

  const markup = firstThree(actions).map((a, i) => {
    const {
      id,
      organization: { name: orgName },
      locality: { name: locName, state_name: stateName },
      target,
      unit_of_measurement: unit,
      budget,
      preview: { type, src, id: testimonialOrSubmissionId },
      donations,
    } = a
    const q = type === 'video' ? `?_mn=testimonial&_ms=${testimonialOrSubmissionId}` : ''

    let labelText
    if (i === 1 && donations.length > 0) {
      const { donor: { name: donorName }, amount } = donations[0]
      labelText = `<span class="strongText">${donorName}</span> invierte ${fmtBudget(amount)} en ${target} ${target !== 1 ? pluralize(unit.toLowerCase()) : unit.toLowerCase()} para ${locName}, ${stateName}.`
    } else {
      labelText = `<span class="strongText">${orgName}</span> realiza ${target} ${target !== 1 ? pluralize(unit.toLowerCase()) : unit.toLowerCase()} en ${locName}, ${stateName} por ${fmtBudget(budget)}.`
    }

    return `<div class="card-container">
      <a class="${type}" href="https://app.brigada.mx/proyectos/${id}${q}" style="background-image: url('${src}')"></a>
      <div class="card-text">
        ${labelText}
      </div>
    </div>`
  })

  _container.innerHTML = markup.join('')
}

const renderOpportunities = ({ results }) => {
  const _container = document.getElementById('brigada-opportunities')

  const firstThree = (items) => {
    const _items = []

    for (const item of items) {
      if (_items.length === 0) {
        _items.push(item)
        continue
      }
      if (_items.length === 1 && _items[0].action.organization.id !== item.action.organization.id) {
        _items.push(item)
        continue
      }
      if (_items.length === 2 && _items[0].action.organization.id !== item.action.organization.id &&
        _items[1].action.organization.id !== item.action.organization.id) {
        _items.push(item)
        break
      }
    }

    if (_items.length === 1 && items.length > 1) _items.push(items[items.length - 1])
    if (_items.length === 2 && items.length > 2) _items.push(items[items.length - 2])
    return _items
  }

  const opportunities = results.filter((o) => {
    const { preview: { src } } = o
    if (!src) return false
    return true
  }).sort((a, b) => rotatingHash(a.id) - rotatingHash(b.id))

  const markup = firstThree(opportunities).map((o) => {
    const {
      id,
      action: { organization: { name: orgName }, locality: { name: locName, state_name: stateName } },
      position,
      target,
      preview: { type, src, id: testimonialOrSubmissionId },
    } = o
    const q = type === 'video' ? `?_mn=testimonial&_ms=${testimonialOrSubmissionId}` : ''

    return `<div class="card-container">
      <a class="${type}" href="https://app.brigada.mx/voluntariado/${id}${q}" style="background-image: url('${src}')"></a>
      <div class="card-text">
        <span class="strongText">${orgName}</span> busca ${target} ${target !== 1 ? pluralize(position.toLowerCase()) : position.toLowerCase()} en ${locName}, ${stateName}.
      </div>
    </div>`
  })

  _container.innerHTML = markup.join('')
}

const fmt = num => {
  if (num === -1 || num === undefined || num === null || num === '') return '-'
  return num.toLocaleString()
}

const renderMap = (localities) => {
  if (!window.mapboxgl) {
    setTimeout(() => renderMap(localities), 2000)
    return
  }

  const mapboxgl = window.mapboxgl
  const { results } = localities

  mapboxgl.accessToken = 'pk.eyJ1Ijoia3lsZWJlYmFrIiwiYSI6ImNqOTV2emYzdjIxbXEyd3A2Ynd2d2s0dG4ifQ.W9vKUEkm1KtmR66z_dhixA'
  const map = new mapboxgl.Map({
    container: 'brigada-map',
    style: 'mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk',
    zoom: 6,
    center: [-95.9042505, 17.1073688],
  })

  map.scrollZoom.disable()

  // creates a popup, but doesn't add it to map yet
  const popup = new mapboxgl.Popup({ closeButton: false, offset: 12 })

  const dmgGrade = (locality) => {
    const levels = [
      [40, 'low'],
      [250, 'medium'],
      [1250, 'high'],
      [Number.MAX_SAFE_INTEGER, 'severe'],
    ]
    const { total } = locality.meta
    if (total === undefined || total === null || total === '' || total === -1) return 'unknown'

    for (const l of levels) {
      if (total < l[0]) return l[1]
    }
    return 'unknown'
  }

  const features = results.map((locality) => {
    const { location: { lat, lng }, meta: { total }, id } = locality
    return {
      type: 'Feature',
      properties: { id, total: total || -1, locality, dmgGrade: dmgGrade(locality) },
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      }
    }
  })

  map.on('load', () => {
    map.addLayer({
      id: 'damage',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        }
      },
      paint: {
        'circle-radius': {
          property: 'total',
          stops: [
            [-1, 4],
            [1, 3],
            [3, 3.5],
            [10, 4],
            [30, 4.5],
            [100, 5.5],
            [300, 7],
            [600, 10],
            [1000, 13],
            [2000, 16],
            [3000, 20],
            [4000, 25],
            [7000, 30],
            [10000, 35],
            [15000, 40],
          ],
        },
        'circle-color': {
          property: 'total',
          stops: [
            [-1, '#939AA1'],
            [0, '#eedd00'],
            [40, '#ddaa00'],
            [250, '#dd6600'],
            [1250, '#ff0000'],
          ],
        },
        'circle-opacity': 0.75,
      },
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-left')

    map.on('mousemove', 'damage', (e) => {
      // change the cursor style as a ui indicator
      map.getCanvas().style.cursor = 'pointer'

      // populate the popup and set its coordinates based on the feature
      const feature = e.features[0]
      showPopup(feature)
    })

    map.on('mouseleave', 'damage', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    map.on('click', 'damage', (e) => {
      window.location = `https://app.brigada.mx/comunidades/${e.features[0].properties.id}`
    })
  })

  const showPopup = (feature) => {
    const locality = JSON.parse(feature.properties.locality)
    const {
      name,
      state_name: stateName,
      meta: { habit, notHabit, destroyed, margGrade, total },
    } = locality

    const markup = `
      <span class="popup-header">${name}, ${stateName}</span>
      <div class="popup-item"><span class="popup-label">VIVIENDAS DAÑADAS</span> <span class="popup-value">${fmt(total)}</span></div>
      <div class="popup-item"><span class="popup-label">HABITABLES</span> <span class="popup-value">${fmt(habit)}</span></div>
      <div class="popup-item"><span class="popup-label">NO HABITABLES</span> <span class="popup-value">${fmt(notHabit)}</span></div>
      <div class="popup-item"><span class="popup-label">PÉRDIDA TOTAL</span> <span class="popup-value">${fmt(destroyed)}</span></div>
      <div class="popup-item"><span class="popup-label">GRADO MARGINACIÓN</span> <span class="popup-value">${margGrade}</span></div>
    `
    popup.setLngLat(feature.geometry.coordinates).setHTML(markup).addTo(map)
  }

  renderLegend(features)
}

const renderLegend = (features) => {
  const metaByDmgGrade = {
    unknown: {label: 'SIN DATOS', color: '#939AA1'},
    low: {label: 'MENOR', color: '#eedd00'},
    medium: {label: 'MEDIO', color: '#ddaa00'},
    high: {label: 'GRAVE', color: '#dd6600'},
    severe: {label: 'MUY GRAVE', color: '#ff0000'},
  }

  const _legend = document.getElementById('brigada-legend-items')
  const counts = {
    severe: 0,
    high: 0,
    medium: 0,
    low: 0,
    unknown: 0,
  }

  for (let l of features) {
    counts[l.properties.dmgGrade] += 1
  }
  const markup = Object.keys(counts).map(key => {
    const { label, color } = metaByDmgGrade[key]
    return `<div class="legend-item">
      <div class="legend-circle" style="background-color: ${color}"></div>
      <span class="legend-label">${label}</span>
      <span class="legend-count">${fmt(counts[key])}</span>
    </div>`
  })
  _legend.innerHTML = markup.join('\n')
}

const render = (data) => {
  const { metrics, actions, opportunities, localities } = data
  renderMetrics(metrics)
  renderMapHeader(localities)

  renderActions(actions)
  renderOpportunities(opportunities)

  renderMap(localities)
}

const main = () => {
  const _cta = document.getElementById('cta')
  const _joinButton = document.getElementById('join-button')
  _joinButton.addEventListener('click', (e) => {
    if (scrollIntoView(_cta, { behavior: 'smooth' })) e.preventDefault()
  }, false)

  fetch(env.env === 'dev' ? 'http://localhost:8000/api/landing/' : 'http://brigada.mx/landing_data.json')
    .then(r => r.json())
    .catch(e => renderError(e))
    .then(data => render(data))
}

document.addEventListener('DOMContentLoaded', main)
