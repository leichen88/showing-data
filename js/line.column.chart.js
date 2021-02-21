// Parse the Data
d3.csv("data/line-column-chart.csv", function(d) {
  return {

    year: d.year,
    globDisp : +d["Global Displacement"],
    PropDisp: +d["Proportion displaced"]

  }
}).then(function(data){


// set the dimensions and margins of the graph
const margin = {top: 80, right: 20, bottom: 50, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#d3-container-3")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('viewBox','0 0  600 400')
    .attr('preserveAspectRatio','xMinYMin')
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
const xScale = d3.scaleBand()
    .domain(data.map(function(d) { return d.year; })) 
    .range([0, width])
    .padding(.1); 
svg
  .append('g')
  .style("color", "#666666")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale).tickSize(0).tickPadding(8));

// Y scale and Axis
const yScale1 = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return d.globDisp; })]).nice()
    .range([height, 0]);
svg
  .append('g')
  .call(d3.axisLeft(yScale1))
  .call(function(d) { return d.select(".domain").remove()})
  

const yScale2 = d3.scaleLinear()
  .domain([0, d3.max(data, function(d){ return d.PropDisp; })]).nice()
  .range([height, 0]);
svg
.append('g')
.attr("transform", `translate(${width}, 0)`)
.call(d3.axisRight(yScale2))
.call(function(d) { return d.select(".domain").remove()});



// create a tooltip
const tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip");
  


// Three function that change the tooltip when user hover / move / leave a cell
const mouseover = function(d) {
    tooltip
      .style("opacity", .8)
    d3.select(this)
      .style("opacity", .5)
}
const mousemove = function(d) {
  const valueFormat = d3.format(".1f");
    tooltip
      .html(valueFormat(d.globDisp) + " millions")
      .style("top", d3.event.pageY - 10 + "px")
      .style("left", d3.event.pageX + 10 + "px");
}
const mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("opacity", 1)
};

// Bars
const barGroup = svg.selectAll("rect")
  .data(data)
  .enter()
  .append("g")

barGroup
  .append("rect")
    .attr("class", "bar")
    .style("fill", "#6f7eb8")
    .attr("x", function(d) { return xScale(d.year); })
    .attr("y", function(d) { return yScale1(d.globDisp); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale1(d.globDisp); })
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);


svg
    .append("path")
    .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#ec6048")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return xScale(d.year) + xScale.bandwidth() / 2; })
            .y(function(d) { return yScale2(d.PropDisp)})
            );

// set Y axis 1 label
svg
  .append("text")
    .attr("class", "label_left")
    .attr("x", -23)
    .attr("y", -(margin.top/4))
    .attr("text-anchor", "start")
    .style("fill", "#6f7eb8")
  .text("Displaced population (millions)")


// set Y axis 2 label
svg
  .append("text")
    .attr("class", "label_right")
    .attr("x", width+15)
    .attr("y", -(margin.top/4))
    .attr("text-anchor", "end")
    .style("fill", "#ec6048")
  .text("Proportion displaced (number displaced per 1,000 world population)")

// set title
svg
  .append("text")
    .attr("class", "title")
    .attr("x", -23)
    .attr("y", -(margin.top)/1.5)
    .attr("text-anchor", "start")
  .text("Trend of global displacement | 1997 - 2016")

// set source
svg
  .append("text")
    .attr("class", "source")
    .attr("x", width)
    .attr("y", height + margin.bottom/1.6)
    .attr("text-anchor", "end")
  .text("Source: UNHCR, 2016")
  


})
  

