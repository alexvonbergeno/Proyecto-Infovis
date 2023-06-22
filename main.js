// Definimos ctes de visualización

const WIDTH = 1000;
const HEIGHT = 700;
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

function crearMapa(mapdata, populationdata) {
  // console.log(mapdata);
  console.log(populationdata);

  // Definir proyección a utilizar
const projection = d3.geoMercator()
.fitSize([width, height], mapdata);


// Utilizamos multipolígonos para dibujar los países
const path = d3.geoPath()
.projection(projection);


// Definimos la escala logaritmica para el color
const color = d3.scaleLog()
.domain(d3.extent(populationdata, d => d.population))
.range(["#f7fbff", "#08306b"]);

} 

function parseFunction(d) {
  const data = {
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
  }
  return data
}

console.log("Cargando datos...")

// Cargamos los datos
d3.json("data/countries.geojson").then((datos) => {
    d3.csv("data/population.csv", parseFunction).then((populationdata) => {
      crearMapa(datos, populationdata)
    })
  })