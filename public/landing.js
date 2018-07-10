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

const renderActions = ({ results }) => {
  const _container = document.getElementById('brigada-actions')

  const firstThree = (items) => {
    const _items = []

    for (const o of items) {
      if (_items.length === 0) {
        _items.push(o)
        continue
      }
      if (_items.length === 1 && _items[0].organization.id !== o.organization.id) {
        _items.push(o)
        continue
      }
      if (_items.length === 2 && _items[0].organization.id !== o.organization.id &&
        _items[1].organization.id !== o.organization.id) {
        _items.push(o)
        break
      }
    }

    if (_items.length === 1 && items.length > 1) _items.push(items[items.length - 1])
    if (_items.length === 2 && items.length > 2) _items.push(items[items.length - 2])
    return _items
  }

  const actions = results.filter((a) => {
    const { preview: { src } } = a
    if (!src) return false
    return true
  }).sort((a, b) => rotatingHash(a.id) - rotatingHash(b.id))

  const markup = firstThree(actions).map((a) => {
    const {
      id,
      organization: { name: orgName },
      locality: { name: locName, state_name: stateName },
      target,
      unit_of_measurement: unit,
      budget,
      preview: { type, src, id: testimonialOrSubmissionId },
    } = a
    const q = type === 'video' ? `?_mn=testimonial&_ms=${testimonialOrSubmissionId}` : ''

    return `<div class="card-container">
      <a class="${type}" href="https://app.brigada.mx/proyectos/${id}${q}" style="background-image: url('${src}')"></a>
      <div class="card-text">
        <b>${orgName}</b> realiza ${target} ${target !== 1 ? pluralize(unit.toLowerCase()) : unit.toLowerCase()} en ${locName}, ${stateName} por ${fmtBudget(budget)}.
      </div>
    </div>`
  })

  _container.innerHTML = markup.join('')
}

const renderOpportunities = ({ results }) => {
  const _container = document.getElementById('brigada-opportunities')

  const firstThree = (items) => {
    const _items = []

    for (const o of items) {
      if (_items.length === 0) {
        _items.push(o)
        continue
      }
      if (_items.length === 1 && _items[0].action.organization.id !== o.action.organization.id) {
        _items.push(o)
        continue
      }
      if (_items.length === 2 && _items[0].action.organization.id !== o.action.organization.id &&
        _items[1].action.organization.id !== o.action.organization.id) {
        _items.push(o)
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
        <b>${orgName}</b> busca ${target} ${target !== 1 ? pluralize(position.toLowerCase()) : position.toLowerCase()} en ${locName}, ${stateName}.
      </div>
    </div>`
  })

  _container.innerHTML = markup.join('')
}

const render = (data) => {
  const { metrics, actions, opportunities, localities } = data
  renderMetrics(metrics)
  renderActions(actions)
  renderOpportunities(opportunities)
}

// fetch('http://brigada.mx/landing_data.json')
fetch('http://localhost:8000/api/landing/')
  .then(r => r.json())
  .catch(e => renderError(e))
  .then(data => render(data))
