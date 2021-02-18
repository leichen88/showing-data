// Parse the Data
d3.csv("data/column-chart.csv", function(d) {
  return {
    year: +d.year,
    displacement: +d.displacement
  };
}).then(function(data){

// set the dimensions and margins of the graph
const margin = {top: 50, right: 20, bottom: 50, left: 40};
const width = 450 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#d3-container-1")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 450 350")
    .attr("preserveAspectRatio", "xMinYMin")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
const xScale = d3.scaleBand()
    .domain(data.map(function(d) { return d.year; })) 
    .range([0, width])
    .padding(.2); 
svg
  .append('g')
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale).tickSize(0).tickPadding(8));

// Y scale and Axis
const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return d.displacement; })]).nice()
    .range([height, 0]);
svg
  .append('g')
  .call(d3.axisLeft(yScale).tickSize(0).tickPadding(6))
  .call(function(d) { return d.select(".domain").remove()});

// set horizontal grid line
const GridLine = function() { return d3.axisLeft().scale(yScale)};
svg
  .append("g")
    .attr("class", "grid")
  .call(GridLine()
    .tickSize(-width,0,0)
    .tickFormat("")
);  

// create a tooltip
const tooltip = d3.select("body")
  .append("div")
    .attr("id", "chart")
    .attr("class", "tooltip");

// Three function that change the tooltip when user hover / move / leave a cell
const mouseover = function(d) {
    tooltip
      .style("opacity", .8)
    d3.select(this)
      .style("opacity", .5)
}
const mousemove = function(d) {
    tooltip
      .html(+ d.displacement + " millions")
      .style("top", d3.event.pageY - 10 + "px")
      .style("left", d3.event.pageX + 10 + "px");
}
const mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("opacity", 1)
}


// Bars
const barGroup = svg.selectAll("rect")
  .data(data)
  .enter()
  .append("g")

barGroup
  .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d.year); })
    .attr("y", function(d) { return yScale(d.displacement); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d.displacement); })
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);


// set Y axis label
svg
  .append("text")
    .attr("class", "label")
    .attr("x", -20)
    .attr("y", -(margin.top/4))
    .attr("text-anchor", "start")
  .text("Displaced population (millions)")


///set X axis label
// svg
//   .append('text')
//       .attr('class', 'label')
//       .attr('x', width / 2)
//       .attr('y', height + margin.bottom/1.6)
//       .attr('text-anchor', 'middle')
//       .text('Years')

// set title
svg
  .append("text")
    .attr("class", "title")
    .attr("x", -20)
    .attr("y", -(margin.top)/1.5)
    .attr("text-anchor", "start")
  .text("Trend of global displacement | 2007 - 2016")

// set source
svg
  .append("text")
    .attr("class", "source")
    .attr("x", width)
    .attr("y", height + margin.bottom/1.3)
    .attr("text-anchor", "end")
  .text("Source: UNHCR, 2016")
  


})
  

