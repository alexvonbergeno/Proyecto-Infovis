// Definimos ctes de visualización

const WIDTH = 1800;
const HEIGHT = 900;
const margin = {
  top: 20,
  right: 50,
  bottom: 20,
  left: 50
}

const width = WIDTH - margin.left - margin.right;
const height = HEIGHT - margin.top - margin.bottom;




// Creamos el svg
const svg = d3
  .select("#vis")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);


// Creamos el contenedor principal
const mapcontainer = svg
  .append('g')
  .attr('id', 'mapcontainer')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);


const heatcircules = svg
  .append('g')
  .attr('id', 'heatcircules')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);


//





// Creamos el contenedor para el mapa
function crearMapa(mapdata, populationdata, year) {
  // console.log(mapdata);
  console.log(populationdata);

  // Definir proyección a utilizar
  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], mapdata);


  // Utilizamos multipolígonos para dibujar los países
  const path = d3.geoPath()
    .projection(projection);



// ### REVISAR QUE ESCALA ELEGIR ###
  // Definimos la escala logaritmica para el color
  const escalacolor = d3.scaleLog()
    .domain(d3.extent(populationdata, d => d.Population[year]))
    .range(["#F3FF00", "#FF0000"]);

  // ### REVISA ESTA PARTE ###
  const escalacirculos = d3.scaleLog()
    .domain(d3.extent(populationdata, d => d.Population[year]))
    .range([1, 20]);
//

console.log(populationdata[1].Population[year])



  // Dibujamos los países
  mapcontainer
    .selectAll('path')
    .data(mapdata.features)
    .join('path')
    .attr('d', path)
    .attr('fill', 'lightgray')

    generarcirculocalor(populationdata, projection, year, escalacirculos, escalacolor)

} 




function generarcirculocalor(populationdata, projection, year, escalacirculos, escalacolor) {


  heatcircules
    .selectAll('circle')
    .data(populationdata)
    .join(
      enter => {
        const circle = enter.append('circle')

        // Lo fijamos en la coordenada correspondiente
        circle
          .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
          .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
          .attr('r', d =>  escalacirculos(d.Population[year]))
          .attr('fill', d => escalacolor(d.Population[year]))
          .attr('opacity', 1)
          .attr('stroke', 'black')
          .attr('stroke-width', 0.5)
        
        return circle
      }
    )


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

const year = 2022

// Cargamos los datos
d3.json("data/countries.geojson").then((datos) => {
    d3.csv("data/population.csv", parseFunction).then((populationdata) => {
      crearMapa(datos, populationdata, year)
    })
  })


const LINEWIDTH = 800
const LINEHEIGHT = 400

const SVGLINE = d3.select("#line-vis")
    .append("svg")
    .attr("height", LINEHEIGHT)
    .attr("width", LINEWIDTH)
    .style("border", "1px solid black")

const LINEMARGIN = {
    top: 50,
    bot: 80,
    left: 80,
    right: 80
}

const data = [
    {date: 1970, population: 1000},
    {date: 1980, population: 2000},
    {date: 1990, population: 3500},
    {date: 2000, population: 6000},
    {date: 2010, population: 7500},
    {date: 2015, population: 8200},
    {date: 2020, population: 9500},
    {date: 2022, population: 9900}
]


const TimeStart = 1970
const TimeEnd = 2022
const LineWidthScale = d3
    .scaleLinear()
    .domain([1960, 2030])
    .range([LINEMARGIN.left, 800-LINEMARGIN.right])
    


const LineHeightScale = d3
    .scaleLinear()
    .domain([0, 10000])
    .range([400 - LINEMARGIN.top, LINEMARGIN.bot])

const xAxis = d3.axisBottom(LineWidthScale).tickValues([1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022]).tickFormat(d => String(d).replace(",", ""));
const yAxis = d3.axisLeft(LineHeightScale);

SVGLINE.append("g")
    .attr("transform", `translate(${0}, ${LINEHEIGHT - LINEMARGIN.top})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 12)
    .attr("transform", "translate(-8) rotate(-50)")
    

SVGLINE.append("g")
    .attr("transform", `translate(${LINEMARGIN.left}, ${0})`)
    .call(yAxis)
    .selectAll("text")
    .attr("font-size", 12);

const line = d3.line()
    .x(d => LineWidthScale(d.date))
    .y(d => LineHeightScale(d.population))

SVGLINE.append("path")
    .attr("d", line(data))
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)