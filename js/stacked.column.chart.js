// Parse the Data
d3.csv("data/stacked-column-chart.csv", function(d) {
  return {
      year: d.year,
      popIdp: +d.IDPs,
      popRefAsy: +d.Refugeesasylum
    }
}).then(function(data){

const margin =  {top: 100, right: 20, bottom: 50, left: 40};
const width = 450 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom

// list of keys
// const keys = data.columns.slice(1);
const keys = ["popIdp", "popRefAsy"]

//create svg container
const svg = d3.select("#d3-container-3")
  .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0  450 350')
    .attr('preserveAspectRatio','xMinYMin')
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
const xScale = d3.scaleBand()
  .domain(data.map(function(d) { return d.year; }))
  .range([0,width])
  .padding(.2);
svg
  .append("g")
    .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale).tickSize(0).tickPadding(8));

// Y scale and Axis
const yScale = d3.scaleLinear()
  .domain([0,70])
  .range([height,0]);
svg
  .append("g")
  .call(d3.axisLeft(yScale).tickSize(0).tickPadding(6))
  .call(function(d) { return d.select(".domain").remove()});

// set color palette for the bars
const color = d3.scaleOrdinal()
  .domain(keys)
  .range(["#6f7eb8", "#c6cae4"])

// stack the data
const stackedData = d3.stack()
  .keys(keys)
  .order(d3.stackOrderNone)
  .offset(d3.stackOffsetNone)
  (data)
console.log(stackedData)

// horizontal grid line
const makeYLines = function() { return d3.axisLeft()
  .scale(yScale)};
svg
  .append('g')
      .attr('class', 'grid')
  .call(makeYLines()
      .tickSize(-width,0,0)
      .tickFormat('')
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
      .style("stroke", "#EF4A60")
      .style("opacity", .5)
}
const mousemove = function(d) {

  const subgroupName = d3.select(this.parentNode).datum().key;
  const subgroupValue = d.data[subgroupName] 

    tooltip
      .html(subgroupValue + " millions")
      .style("top", d3.event.pageY - 10 + "px")
      .style("left", d3.event.pageX + 10 + "px")
}
const mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
}


// Bar
  svg
  .append("g")
  .selectAll("g")
  .data(stackedData)
  .enter()
  .append("g")
      .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
      .attr("x",function(d) { return xScale(d.data.year); })
      .attr("y",function(d) { return yScale(d[1]); })
      .attr("width", xScale.bandwidth())
      .attr("height",function(d) { return yScale(d[0]) - yScale(d[1]); })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

svg
  .append('text')
      .attr('class', 'label')
      .attr('x', -23)
      .attr('y', -(margin.top/4))
      .attr('text-anchor', 'start')
      .text('Displaced population (millions)')


// set title
svg
  .append('text')
      .attr('class', 'title')
      .attr('x', -23)
      .attr('y', -(margin.top)/1.5)
      .attr('text-anchor', 'start')
      .text('Trend of global displacement | 2007 - 2016 (in millions)')


// set data source
svg
  .append('text')
      .attr('class', 'source')
      .attr('x', width)
      .attr('y', height + margin.bottom/1.6)
      .attr('text-anchor', 'end')
      .text('Source: UNHCR, 2016')


// set legend

const legLabel = ["IDP", "Refugees and Asylum-seekers"],
      legspaceing = 22;

const legend = svg
  .selectAll(".legend")
  .data(keys.slice().reverse())
  .enter()
  .append("g")
  .attr("transform", "translate("+(width-20)+", "+(-margin.top/2)+")");

legend
  .append("rect")
      .attr("x", 0)
      .attr("y", function(d, i) { return i*legspaceing })
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", color);

legend
  .append("text")
      .attr("class", "label")
      .attr("x", -5)
      .attr("y", function(d,i) { return i*legspaceing + legspaceing/2; })
      .attr("text-anchor", "end")
      .attr("alignment-baseline","middle")
  .text(function(d, i) { return legLabel[i]; });

})
