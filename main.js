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


var projection;
var populationdat;
var datos;
var zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on('zoom', zoomed);
var escalacirculos;
var escalacolor;


// Creamos el contenedor para el mapa
function crearMapa(mapdata, populationdata, year) {
  populationdat = populationdata
  // console.log(mapdata);
  // console.log(populationdata);

  // Definir proyección a utilizar
  projection = d3.geoNaturalEarth1()
    .fitSize([width, height], mapdata);


  // Utilizamos multipolígonos para dibujar los países
  const path = d3.geoPath()
    .projection(projection);



// ### REVISAR QUE ESCALA ELEGIR ###
  // Definimos la escala logaritmica para el color
  escalacolor = d3.scaleLog()
    .domain(d3.extent(populationdata, d => d.Population[year]))
    .range(["#F3FF00", "#FF0000"]);

  // ### REVISA ESTA PARTE ###
  escalacirculos = d3.scaleLog()
    .domain(d3.extent(populationdata, d => d.Population[year]))
    .range([1, 20]);
//



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

  console.log(year)

  heatcircules
    .selectAll('circle')
    .data(populationdata, d => d.Population[year])
    .join(
      enter => {
        const circle = enter.append('circle')
        console.log('enter')

        // Lo fijamos en la coordenada correspondiente
        circle
          .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
          .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
          .attr('class', 'heatcircle')
          .attr('r', d =>  escalacirculos(d.Population[year]))
          .attr('fill', d => escalacolor(d.Population[year]))
          .attr('opacity', 1)
          .attr('stroke', 'black')
          .attr('stroke-width', 0.5)
        
        return circle
      },
      update => {
        // En la fase de actualización, cambiamos los atributos de los círculos existentes
        update
          .transition()
          .duration(1000)
          .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
          .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
          .attr('r', d =>  escalacirculos(d.Population[year]))
          .attr('fill', d => escalacolor(d.Population[year]));
        
          return update
      },
      exit => {
        console.log('exit')
        exit
          .transition()
          .duration(1000)
          .attr('r', 0)
          .attr('opacity', 0)
          .remove()
      }
    )


}


function zoomed(event) {
  // console.log(event.transform);
  mapcontainer.attr("transform", event.transform);
  heatcircules.attr("transform", event.transform);
}

function prueba() {
  console.log('prueba');
  console.log(projection)
  console.log(escalacirculos)
  console.log(escalacolor)
  console.log(populationdat)

  generarcirculocalor(populationdat, projection, 1980, escalacirculos, escalacolor)
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
var audio;
audio = new Audio('cancion.mp3');

function reproducirCancion() {
  audio.play();
  activo = true;
}

function pausarCancion() {
  if (audio) {
    audio.pause();
    activo = false;
  }
}

function detenerCancion() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}



// Definimos una variable para controlar si el hilo está activo
let activo = false;

// Lista de años para seleccionar al azar
const anos = [2022, 2020, 2015, 2010, 2000, 1990, 1980, 1970];

// Definimos la función que se ejecutará cada 1.5 segundos
function actualizar() {
  if (!activo) {
    return;
  }

  // Seleccionamos un año al azar de la lista
  const ano = anos[Math.floor(Math.random() * anos.length)];

  // console.log(ano);
  // Actualizamos el svg generado con la función generarcirculocalor
  generarcirculocalor(populationdat, projection, ano, escalacirculos, escalacolor);
}

// Iniciamos el hilo
const intervalId = setInterval(actualizar, 1000);

// Si quieres detener el hilo en algún momento, puedes usar
// clearInterval(intervalId);







const year = 2022

// Cargamos los datos
d3.json("data/countries.geojson").then((datos) => {
    d3.csv("data/population.csv", parseFunction).then((populationdata) => {
      crearMapa(datos, populationdata, year)
    })
  })