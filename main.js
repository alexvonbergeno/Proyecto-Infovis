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


// Gráfico de Linea

const LINEWIDTH = 1200
const LINEHEIGHT = 600

const SVGLINE = d3.select("#line-vis")
  .append("svg")
  .attr("height", LINEHEIGHT)
  .attr("width", LINEWIDTH)

SVGLINE.append("text")
  .text("Población por País")
  .attr("class", "line-title-text")
  .attr("x", LINEWIDTH / 2)
  .attr("y", 30)

const LINEMARGIN = {
  top: 120,
  bot: 120,
  left: 120,
  right: 200
}

const MAXPOP =  1500000000
const LineAnimationDelay = 2000
const TimeStart = 1970
const TimeEnd = 2022
const LineWidthScale = d3
  .scaleLinear()
  .domain([1965, 2025])
  .range([LINEMARGIN.left, LINEWIDTH-LINEMARGIN.right])
    


const LineHeightScale = d3
  .scaleLinear()
  .domain([0, MAXPOP])
  .range([LINEHEIGHT - LINEMARGIN.top, LINEMARGIN.bot])


const LineColors = d3.schemeSet1

// Ejes

const xAxis = d3.axisBottom(LineWidthScale)
  .tickValues([1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022])
  .tickFormat(d => String(d).replace(",", ""))

const yAxisTickFormat = d3.format("~")
const yAxis = d3.axisLeft(LineHeightScale)
  .tickFormat(t => `${t / 1000000} M`)

SVGLINE.append("g")
  .attr("transform", `translate(${0}, ${LINEHEIGHT - LINEMARGIN.top})`)
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("font-size", 18)
  .attr("transform", "translate(-8) rotate(-50)")
    

SVGLINE.append("g")
  .attr("transform", `translate(${LINEMARGIN.left}, ${0})`)
  .call(yAxis)
  .selectAll("text")
  .attr("font-size", 15);


// Grid
const VerticalGridlines = d3.axisBottom()
  .tickFormat("")
  .tickSize(-LINEHEIGHT + LINEMARGIN.top + LINEMARGIN.bot)
  .scale(LineWidthScale);

const HorizontalGridlines = d3.axisLeft()
  .tickFormat("")
  .tickSize(-LINEWIDTH + LINEMARGIN.left + LINEMARGIN.right)
  .scale(LineHeightScale);

SVGLINE.append("g")
  .attr("transform", `translate(${0}, ${LINEHEIGHT - LINEMARGIN.top})`)
  .call(VerticalGridlines)
  .style("opacity", 0.2)

SVGLINE.append("g")
  .attr("transform", `translate(${LINEMARGIN.left}, ${0})`)
  .call(HorizontalGridlines)
  .style("opacity", 0.2)


// Lineas
const line = d3.line()
  .x(d => LineWidthScale(d.date))
  .y(d => LineHeightScale(d.population))

const zeroLine = d3.line()
  .x(d => LineWidthScale(d.date))
  .y(LINEHEIGHT-LINEMARGIN.bot)


function parseLineData(data) {
  const lineData = []
  let i = 0
  data.forEach(country => {
    let popbydate = []
    Object.keys(country.Population).forEach( year => {
      popbydate.push({
        date: year,
        population: country.Population[year]
      })
    })
    lineData.push({
      Country: country.Country,
      Rank: country.Rank,
      CCA3: country.CCA3,
      popdata: popbydate,
      color: LineColors[i]
    })
    i = ++i % 8
  })
  return lineData.sort((a, b) => a.popdata[2022] - b.popdata[2022])
}

function parseRowCSV(d) {
  const data = {
    Rank: +d.Rank,
    CCA3: d.CCA3,
    Country: d.Country,
    popdata: [
      {date:1970, population: +d['1970']},
      {date:1980, population: +d['1980']},
      {date:1990, population: +d['1990']},
      {date:2000, population: +d['2000']},
      {date:2010, population: +d['2010']},
      {date:2015, population: +d['2015']},
      {date:2020, population: +d['2020']},
      {date:2022, population: +d['2022']},
    ],
    color: LineColors[i]
  }
  i = ++i % 8
  return data
}


function makeLineGraph(data) {
  const selectedCountries = data.slice(0, 8)
  SVGLINE.selectAll("path.country-line")
    .data(selectedCountries)
    .join(
     enter => {
      let g = enter;
      g.append("path")
      .attr("class", "country-line")
      .attr("stroke", d => d.color)
      .attr("d", d => zeroLine(d.popdata))
      .transition()
      .duration(LineAnimationDelay)
      .attr("d", d => line(d.popdata))
      
      g.append("circle")
      .attr("class", "line-marker")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("cy", d => LineHeightScale(d.popdata[0].population))
      .attr("cx", LineWidthScale(1970))
      .transition()
      .delay(LineAnimationDelay)
      .duration(500)
      .attr("r", 5)

      g.append("circle")
      .attr("class", "line-marker")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("cy", d => LineHeightScale(d.popdata[1].population))
      .attr("cx", LineWidthScale(1980))
      .transition()
      .delay(LineAnimationDelay)
      .duration(500)
      .attr("r", 5)

      g.append("circle")
      .attr("class", "line-marker")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("cy", d => LineHeightScale(d.popdata[2].population))
      .attr("cx", LineWidthScale(1990))
      .transition()
      .delay(LineAnimationDelay)
      .duration(500)
      .attr("r", 5)

      g.append("circle")
      .attr("class", "line-marker")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("cy", d => LineHeightScale(d.popdata[3].population))
      .attr("cx", LineWidthScale(2000))
      .transition()
      .delay(LineAnimationDelay)
      .duration(500)
      .attr("r", 5)

      g.append("circle")
      .attr("class", "line-marker")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("cy", d => LineHeightScale(d.popdata[4].population))
      .attr("cx", LineWidthScale(2010))
      .transition()
      .delay(LineAnimationDelay)
      .duration(500)
      .attr("r", 5)

      g.append("circle")
      .attr("class", "line-marker")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("cy", d => LineHeightScale(d.popdata[5].population))
      .attr("cx", LineWidthScale(2015))
      .transition()
      .delay(LineAnimationDelay)
      .duration(500)
      .attr("r", 5)

      g.append("circle")
      .attr("class", "line-marker")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("cy", d => LineHeightScale(d.popdata[6].population))
      .attr("cx", LineWidthScale(2020))
      .transition()
      .delay(LineAnimationDelay)
      .duration(500)
      .attr("r", 5)

      g.append("circle")
      .attr("class", "line-marker")
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("cy", d => LineHeightScale(d.popdata[7].population))
      .attr("cx", LineWidthScale(2022))
      .transition()
      .delay(LineAnimationDelay)
      .duration(500)
      .attr("r", 5)

     },
    exit => exit
      .transition()
      .duration(1000)
      .attr("d", d => zeroLine(d.popdata))
    )
  

  SVGLINE.selectAll("circle.country-legend-color")
    .data(selectedCountries)
    .join("circle")
    .attr("class", "country-legend-color")
    .attr("r", 5)
    .attr("cx", LINEWIDTH - 150)
    .attr("cy", d => 150 + 40 * data.indexOf(d))
    .attr("fill", d => d.color)
  
  SVGLINE.selectAll("text.country-legend-country-name")
    .data(selectedCountries)
    .join("text")
    .text(d => d.Country)
    .attr("class", "country-legend-country-name")
    .attr("x", LINEWIDTH - 120)
    .attr("y", d => 150 + 40 * data.indexOf(d))

}


let i = 0;
d3.csv("data/population.csv", parseRowCSV).then((populationdata) => {
  makeLineGraph(populationdata)
})
