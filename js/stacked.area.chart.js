// Parse the Data
d3.csv("data/stacked-area-chart.csv", function(d) {
  const perseTime = d3.timeParse("%Y")
  return {
        year: perseTime(d.year),
        "Conflict-generated" : +d["Conflict-generated"],
        "Protected by UNHCR" : +d["Protected by UNHCR"]

  }
}).then(function(data){


console.log(data)

const margin =  {top: 120, right: 20, bottom: 70, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// list of keys
const keys = data.columns.slice(1)

console.log(keys)

//create svg container
const svg = d3.select("#d3-container-3")
  .append("svg")
    .attr("width","100%")
    .attr("height","100%")
    .attr("viewBox","0 0  600 400")
    .attr("preserveAspectRatio","xMinYMin")
  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
const xScale = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.year }))
  .range([0,width])
svg
  .append("g")
    .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale).tickPadding(8).tickSizeOuter(0));

// Y scale and Axis
const yScale = d3.scaleLinear()
  .domain([0,45])
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

// set transparant when user hover and leave the chart
const mouseover = function(d) { 
    
    d3.select(this)
      .style("stroke", "#EF4A60")
      .style("opacity", .5)
}

const mouseleave = function(d) {
   
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
}

const parseTime = d3.timeParse("%Y")

// create area
  svg
  .append("g")
  .selectAll("path")
  .data(stackedData)
  .enter()
  .append("path")
      .attr("fill", function(d) { return color(d.key); })
      .attr("d", d3.area()
          .x(function(d) { return xScale(d.data.year); })
          .y0(function(d) { return yScale(+d[0]);})
          .y1(function(d) { return yScale(+d[1]);})
      )
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
        


svg
  .append('text')
      .attr('class', 'label')
      .attr('x', -23)
      .attr('y', -(margin.top/4))
      .attr('text-anchor', 'start')
      .text('Population (millions)')

// set title
svg
  .append('text')
      .attr('class', 'title')
      .attr('x', -23)
      .attr('y', -(margin.top)/1.2)
      .attr('text-anchor', 'start')
      .text('IDPs protected/assisted by UNHCR vs Global number')
svg
  .append('text')
      .attr('class', 'title')
      .attr('x', -23)
      .attr('y', -(margin.top)/1.5)
      .attr('text-anchor', 'start')
      .text('of conflict-generated IDPs | 2007-2016')

      
svg
.append('text')
    .attr('class', 'title2')
    .attr('x', -23)
    .attr('y', -(margin.top)/2.2)
    .attr('text-anchor', 'start')
    .text('Includes people in an IDP-like situation, (millions)')

// set data source
svg
  .append('text')
      .attr('class', 'source')
      .attr('x', width)
      .attr('y', height + margin.bottom/1.6)
      .attr('text-anchor', 'end')
      .text('Source: UNHCR, 2016')


// set legend

const legLabel = ["Protected by UNHCR", "Conflict-generated"],
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
