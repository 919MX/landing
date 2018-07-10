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
  const actions = results.slice(0, 3).map((a) => {
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

    return `<div class="action-container">
      <a class="${type}" href="https://app.brigada.mx/proyectos/${id}${q}" style="background-image: url('${src}')"></a>
      <div class="card-text">
        <b>${orgName}</b> realiza ${target} ${target !== 1 ? pluralize(unit.toLowerCase()) : unit.toLowerCase()} en ${locName}, ${stateName} por ${fmtBudget(budget)}.
      </div>
    </div>`
  })
  _container.innerHTML = actions.join('')
}

const renderOpportunities = ({ results }) => {
  const _container = document.getElementById('brigada-opportunities')
  const opportunities = results.slice(0, 3).map((o) => {
    const {
      id,
      action: { organization: { name: orgName }, locality: { name: locName, state_name: stateName } },
      position,
      target,
      preview: { type, src, id: testimonialOrSubmissionId },
    } = o
    const q = type === 'video' ? `?_mn=testimonial&_ms=${testimonialOrSubmissionId}` : ''

    return `<div class="action-container">
      <a class="${type}" href="https://app.brigada.mx/voluntariado/${id}${q}" style="background-image: url('${src}')"></a>
      <div class="card-text">
        <b>${orgName}</b> busca ${target} ${target !== 1 ? pluralize(position.toLowerCase()) : position.toLowerCase()} en ${locName}, ${stateName}.
      </div>
    </div>`
  })
  _container.innerHTML = opportunities.join('')
}

const render = (data) => {
  const { metrics, actions, opportunities, localities } = data
  renderMetrics(metrics)
  renderActions(actions)
  renderOpportunities(opportunities)
}

fetch('http://brigada.mx/landing_data.json')
  .then(r => r.json())
  .catch(e => renderError(e))
  .then(data => render(data))
