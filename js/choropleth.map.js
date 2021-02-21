//set svg
var width = 600,
    height = 420

const svg = d3.select("#d3-container-3")
      .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox","0 0  600 420")
        .attr("preserveAspectRatio","xMinYMin");

// set map scale, location on screen and its projection
const projection = d3.geoNaturalEarth1()
        .scale(120)
        // .center([0, 0])
        .translate([width/2, height/1.8])

// path generator
const path = d3.geoPath()
        .projection(projection)

// set color scale
const color = d3.scaleThreshold()
        .domain([1000,10000,100000,1000000,2000000])
        .range(["#d8f8d9", "#b8f1b8", "#92ec89", "#77e868", "#70d660"])
        .unknown("#ccc")

// set legend
svg.append("g")
  .attr("class", "legendThreshold")
  .attr("transform", "translate(20,280)")

const legend = d3.legendColor()
.labelFormat(d3.format(",.0f"))
.labels(d3.legendHelpers.thresholdLabels)
.labelOffset(8)
// .useClass(true)
// .title("Refugee Population")
.titleWidth(200)
.shapePadding(0)
.scale(color)

svg.select(".legendThreshold")
    .call(legend)
      
// load data
const promises = [
  d3.json("data/wrl_polbnda_int_15_uncs.json"),
  d3.csv("data/choropleth-map.csv")
]
   
Promise.all(promises).then(ready)

function ready([world, population]) {


// prepare pop data to join shapefile
  const data = {};
  population.forEach(function(d){
    data[d.ISO3] = +d.pop
  })

console.log(world)
console.log(data)
console.log(topojson.feature(world, world.objects.wrl_polbnda_int_15_uncs).features)

// set mouse events
const mouseover = function(d) {
  d3.selectAll(".countries")
    .transition()
    .duration(100)
    .style("opacity", .3)
  d3.select(this)
    .transition()
    .duration(100)
    .style("opacity", 1) 
}
const mouseleave = function(d) {
  d3.selectAll(".countries")
    .transition()
    .duration(100)
    .style("opacity", 1)
  d3.select(this)
    .transition()
    .duration(100)
    .style("opacity", 1)
}

// number format
const formatNum = d3.format(",")

// draw map
svg
  .append("g")
  .selectAll("path")
  .data(topojson.feature(world, world.objects.wrl_polbnda_int_15_uncs).features)
  .join("path")
    .attr("fill", function(d) { return color(d.pop = data[d.properties.COLOR_CODE])})
    .attr("d", path)
    .attr("class", function(d){ return "countries" } )
  .on("mouseover", mouseover)
  .on("mouseleave", mouseleave)
  .append("title")
    .text(function(d) { return `${d.properties.Terr_Name} 
Refugee Population: ${formatNum(d.pop)}`})
    
// set boundaries
svg
  .append("path")
    .attr("class", "boundaries")
  .datum(topojson.mesh(world, world.objects.wrl_polbnda_int_15_uncs, function(a, b) { return a !== b; }))
    .attr("d", path)

// set title
svg
  .append("text")
    .attr("class", "title")
    .attr("x", 40)
    .attr("y", 30)
    .attr("text-anchor", "start")
  .text("Global Refugee displacement | 2019")
};

svg
  .append('text')
      .attr('class', 'source')
      .attr('x', width-5)
      .attr('y', height)
      .attr('text-anchor', 'end')
      .text('Source: UNHCR, 2019')
  


