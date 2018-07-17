export const fmtSpent = (b) => {
  return Math.round(b / 100000) / 10
}

export const fmtBudget = (b) => { // round to 1 or 0 decimal places
  if (!b) return '$'
  const millions = Math.round(b / 100000) / 10
  if (millions >= 100) return `$${Math.round(millions)}M`
  if (millions) return `$${millions}M`

  const thousands = Math.round(b / 1000)
  return `$${thousands}K`
}

export const scrollIntoView = (el, options) => {
  if (typeof el.scrollIntoView === 'function') {
    el.scrollIntoView(options)
    return true
  }
  return false
}

export const dayOfYear = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}

export const hash = (n) => {
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

export const rotatingHash = (n, days = 3) => {
  return hash(n + Math.floor(dayOfYear() / days))
}
