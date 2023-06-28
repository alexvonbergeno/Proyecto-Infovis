// Definimos ctes de visualización

const TOPWIDTH = 900;
const TOPHEIGHT = 600;
const TOPmargin = {
  top: 20,
  right: 50,
  bottom: 20,
  left: 50
}

const topwidth = TOPWIDTH - TOPmargin.left - TOPmargin.right;
const topheight = TOPHEIGHT - TOPmargin.top - TOPmargin.bottom;

var year = 1970; 



// Creamos el svg
const top_svg = d3
  .select("#topgraph")
  .append("svg")
  .attr("width", TOPWIDTH)
  .attr("height", TOPHEIGHT);

// Creamos el contenedor principal
const graph = top_svg
  .append('g')
  .attr('id', 'vis_graph')
  .attr('transform', `translate(${TOPmargin.left}, ${TOPmargin.top})`);

// Barras
const bars = graph
    .append('g')
    .attr('id', 'bars')
    .attr('transform', `translate(${TOPmargin.left}, ${TOPmargin.top})`);

// Eje Y
const yaxis = graph
    .append('g')
    .attr('id', 'yaxis')
    .attr('transform', `translate(${TOPmargin.left}, ${TOPmargin.top})`)
    .attr('font-size', '15px');

// Eje X
const xaxis = graph 
    .append('g')
    .attr('id', 'xaxis')
    .attr('transform', `translate(${TOPmargin.left}, ${520})`);



function mostrargrafico(populationdata, year) {
      // Seleccionar el elemento h1 con la clase "ano" e ID "ano"
    var title_text = document.querySelector('h1.top5#top5');


    // Cambiar el texto del elemento seleccionado
    title_text.innerText = "Top 5 ciudades más pobladas en " +  year.toString();

    // Ordena los datos en orden descendente y toma los primeros 5
    let top5 = populationdata.sort((a, b) => b.Population[year] - a.Population[year]).slice(0, 5);

    // Escala para el eje X
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(top5, d => d.Population[year])])
        .range([0, topwidth - TOPmargin.left - TOPmargin.right]);

    let yScale = d3.scaleBand()
        .domain(top5.map(d => d.Country))
        .range([0, 500])

    // Crea una escala de color
    let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Entregamos datos a los ejes
    xaxis.call(d3.axisBottom(xScale).tickFormat(t => `${t / 1000000} M`));
    yaxis.call(d3.axisLeft(yScale));


    // Crea los rectángulos
    bars
        .selectAll('rect')
        .data(top5)
        .join(
            enter => {
                const rect = enter.append('rect')

                rect
                    .attr('x', TOPmargin.left - 30)
                    .attr('y', d => yScale(d.Country))
                    .attr('width', d => xScale(d.Population[year]))
                    .attr('height', yScale.bandwidth() - 10)
                    .attr('fill', d => colorScale(d.Country))
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .on('mouseover', function (event, d) {
                        d3.select(this)
                            .attr('stroke-width', 3)
                            .attr('stroke', 'black')
                    })
                    .on('mouseout', function (event, d) {
                        d3.select(this)
                            .attr('stroke-width', 1)
                            .attr('stroke', 'black')
                    })
                    .on('click', function (event, d) {
                        mostrarinfopais(populationdata, d.ID)
                    })
                
                    rect.append('title')
                      .text(d => `Poblacón: ${Math.floor(d.Population[year] / 1000000)} M`)
                return rect
            },
            update => {
                update
                    .transition()
                    .duration(100)
                    .attr('x', TOPmargin.left - 30)
                    .attr('y', d => yScale(d.Country))
                    .attr('width', d => xScale(d.Population[year]))
                    .attr('height', yScale.bandwidth() - 10)
                    .attr('fill', d => colorScale(d.Country))
                    .select('title')
                    .text(d => `Población: ${Math.floor(d.Population[year] / 1000000)} M`)
                    .end()
                    .then(() => {
                      update.on('click', function (event, d) {
                        mostrarinfopais(populationdata, d.ID)
                      })
                    });
                    
            },
            exit => {
                exit
                  .transition()
                  .duration(100)
                  .attr('width', 0)
                  .remove()
            }
        )

    // Elegimos al azar entre los 5 países
    let random = Math.floor(Math.random() * 5);

    // Llamamos a la función para mostrar la información del país
    mostrarinfopais(populationdata, top5[random].ID)

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

d3.csv("data/population.csv", parseFunction).then((populationdata) => {
    mostrargrafico(populationdata, year)
  })