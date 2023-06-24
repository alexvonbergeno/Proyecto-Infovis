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