const info_svg = d3
  .select("#infograph")
  .append("svg")
  .attr("width", TOPWIDTH + 120)
  .attr("height", TOPHEIGHT);

const info = info_svg
  .append('g')
  .attr('id', 'info')
  .attr('transform', `translate(${TOPmargin.left}, ${TOPmargin.top})`);

// Circulos
const circles = info
  .append('g')
  .attr('id', 'circles')
  .attr('transform', `translate(${TOPmargin.left}, ${TOPmargin.top})`);

// Lineas
const lines = info
  .append('g')
  .attr('id', 'lines')
  .attr('transform', `translate(${TOPmargin.left}, ${TOPmargin.top})`);


// Eje Y  
const info_yaxis = info
  .append('g')
  .attr('id', 'info_yaxis')
  .attr('transform', `translate(${TOPmargin.left}, ${TOPmargin.top - 60})`)

// Eje X
const info_xaxis = info
  .append('g')
  .attr('id', 'info_xaxis')
  .attr('transform', `translate(${TOPmargin.left}, ${TOPHEIGHT - 2 * TOPmargin.top})`)




function mostrarinfopais(populationdata, id) {
  const pais = populationdata.find(pais => pais.ID === id);

  // Seleccionar el elemento h1 con la clase "ano" e ID "ano"
  var title_text = document.querySelector('h1#info');

  // Cambiar el texto del elemento seleccionado
  title_text.innerText = "Gráfico de crecimiento de la población de " + pais.Country;

  // Crear escala para el eje X
  const xScale = d3.scaleLinear()
    .domain(d3.extent(Object.keys(pais.Population).map(year => parseInt(year))))
    .range([0, TOPWIDTH]);

  // Crear escala para el eje Y
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(Object.values(pais.Population))])
    .range([TOPHEIGHT, 0]);

  // Definir la línea
  const line = d3.line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.population));

  // Crear array de datos para la línea
  const linedata = Object.keys(pais.Population).map(key => ({
    year: parseInt(key),
    population: pais.Population[key]
  }));

  lines
    .selectAll('path')
    .data(linedata)
    .join(
      enter => {
        const path = enter.append('path')
          .attr('class', 'line')
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('d', d => line(linedata))
          .transition();

        },
      update => {
        update.attr('d', d => line(linedata))
      },
      exit => {
        exit.remove()
      }
    )


  // Dibujar los círculos
  circles
    .selectAll('circle')
    .data(linedata)
    .join(
      enter => {
        const circle = enter.append('circle')
          .attr('class', 'circle')
          .attr('cx', (d) => xScale(d.year))
          .attr('cy', (d) => yScale(d.population))
          .attr('r', 5);
      },
      update => {
        update
          .attr('cx', (d) => xScale(d.year))
          .attr('cy', (d) => yScale(d.population))
      },
      exit => {
        exit.remove()
      }
    )

  // Dibujar los ejes
  const xAxis = d3.axisBottom(xScale).ticks(linedata.length).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale);

  info_xaxis.call(xAxis);
  info_yaxis.call(yAxis);
}
  