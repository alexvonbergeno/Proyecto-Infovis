// Definimos ctes de visualización

const TOPWIDTH = 900;
const TOPHEIGHT = 500;
const TOPmargin = {
  top: 20,
  right: 50,
  bottom: 20,
  left: 50
}

const topwidth = TOPWIDTH - TOPmargin.left - TOPmargin.right;
const topheight = TOPHEIGHT - TOPmargin.top - TOPmargin.bottom;




// Creamos el svg
const top_svg = d3
  .select("#topgraph")
  .append("svg")
  .attr("width", TOPWIDTH)
  .attr("height", TOPHEIGHT);


// Creamos el contenedor principal
const graph = top_svg
  .append('g')
  .attr('id', 'topgraph')
  .attr('transform', `translate(${TOPmargin.left}, ${TOPmargin.top})`);

// Ejes


function mostrargrafico(populationdata, year) {
    // Ordena los datos en orden descendente y toma los primeros 5
    let top5 = populationdata.sort((a, b) => b.Population[year] - a.Population[year]).slice(0, 5);

    // Crea las escalas
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(top5, d => d.Population[year])])
        .range([0, 800]);

    let yScale = d3.scaleBand()
        .domain(top5.map(d => d.Country))
        .range([0, TOPHEIGHT - TOPmargin.bottom - TOPmargin.top])

    // Crea una escala de color
    let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Crea el eje Y
    let yAxis = d3.axisLeft(yScale);

    // Agrega el eje Y al SVG
    top_svg.append("g")
    .call(yAxis);

    // Crea las barras
    let bars = top_svg.selectAll("rect")
        .call(yAxis)
        .data(top5)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => yScale(d.Country))
        .attr("width", d => xScale(d.Population[year]))
        .attr("height", yScale.bandwidth())
        .attr("fill", (d, i) => colorScale(i)); // Agrega color

    // Agrega etiquetas de texto a las barras
    bars.append("text")
        .attr("x", d => xScale(d.Population[year]) + 3) // Ajusta la posición en x
        .attr("y", d => yScale(d.Country) + yScale.bandwidth() / 2) // Ajusta la posición en y
        .text(d => d.Country) // Agrega el nombre del país
        .attr("font-size", "10px")
        .attr("fill", "black");

    bars.append("title")
        .text(d => d.Country); // Agrega el valor de la población
}





function parseFunction(d) {
    const data = {
      ID: +d.ID,
      Rank: +d.Rank,
      CCA3: d.CCA3,
      Country: d.Country,
      Capital: d.Capital,
      Continent: d.Continent,
      Population: {
        2022: +d['2022'],
        2020: +d['2020'],
        2015: +d['2015'],
        2010: +d['2010'],
        2000: +d['2000'],
        1990: +d['1990'],
        1980: +d['1980'],
        1970: +d['1970'],
      },
      Area: +d.Area,
      Density: +d.Density,
      Growth: +d.Growth,
      WorldPercentage: +d.WPPercentage,
      Latitude: +d.Latitude,
      Longitude: +d.Longitude,
    }
    return data
  }
  
  
  

var year = 1970 

d3.csv("data/population.csv", parseFunction).then((populationdata) => {
    mostrargrafico(populationdata, year)
  })