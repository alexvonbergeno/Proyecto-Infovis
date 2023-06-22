const SVGLINE = d3.select("#line-vis")
    .append("svg")
    .attr("height", 400)
    .attr("width", 800)
    .style("border", "1px solid black")

const MARGIN = {
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
    .range([MARGIN.left, 800-MARGIN.right])
    


const LineHeightScale = d3
    .scaleLinear()
    .domain([0, 10000])
    .range([400 - MARGIN.top, MARGIN.bot])

const xAxis = d3.axisBottom(LineWidthScale).tickValues([1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022]).tickFormat(d => String(d).replace(",", ""));
const yAxis = d3.axisLeft(LineHeightScale);

SVGLINE.append("g")
    .attr("transform", `translate(${0}, ${400 - MARGIN.top})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 12)
    .attr("transform", "translate(-8) rotate(-50)")
    

SVGLINE.append("g")
    .attr("transform", `translate(${MARGIN.left}, ${0})`)
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