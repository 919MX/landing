const render = (data) => {
  console.log(data)
}

fetch('http://brigada.mx/landing_data.json')
  .then(r => r.json())
  .then(data => render(data))
