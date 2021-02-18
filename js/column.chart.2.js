// Parse the Data
d3.csv("data/column-chart-2.csv", function(d) {
  return {
      year: +d.Year,
      population: +d.Refugee_number
    }
}).then(function(data){

  const margin = {top: 50, right: 20, bottom: 50, left: 40};
  const width = 450 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

//create svg container
const svg = d3.select("#d3-container-2")
  .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 450 350")
      .attr("preserveAspectRatio", "xMinYMin")
  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
const xScale = d3.scaleBand()
  .domain(data.map(function(d){ return d.year; }))
  .range([0,width])
  .padding(.4);
svg
  .append("g")
      .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale).tickSize(0).tickPadding(8));

// Y scale and Axis
const yScale = d3.scaleLinear()
  .domain([0,16])
  .range([height,0]);
svg
  .append("g")
  .call(d3.axisLeft(yScale).tickSize(0).tickPadding(6))
  .call(function(g) { return g.select(".domain").remove()});

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


const mouseenter = function (actual, i) {
  d3.selectAll('.value')
      .attr('opacity', 0)

  d3.select(this)
      .transition()
      .duration(300)
      .attr('opacity', 0.6)
      .attr('x', function(d) { return xScale(d.year) - 5; })
      .attr('width', xScale.bandwidth() + 10)

  const y = yScale(actual.population)

  line = svg
  .append('line')
      .attr('id', 'limit')
      .attr('x1', 0)
      .attr('y1', y)
      .attr('x2', width)
      .attr('y2', y)

  barGroup
  .append('text')
      .attr('class', 'divergence')
      .attr('x', (d) => xScale(d.year) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.population) + 30)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text((d, idx) => {
      const divergence = (d.population - actual.population).toFixed(1)

      let text = ''
      if (divergence > 0) text += '+'
      text += `${divergence}`

      return idx !== i ? text : '';
    })

}

const mouseleave = function () {
  d3.selectAll('.value')
    .attr('opacity', 1)

  d3.select(this)
      .transition()
      .duration(300)
      .attr('opacity', 1)
      .attr('x', function(d) { return xScale(d.year); })
      .attr('width', xScale.bandwidth())

  svg.selectAll('#limit').remove()
  svg.selectAll('.divergence').remove()
}


// Bar
const barGroup = svg.selectAll("rect")
  .data(data)
  .enter()
  .append("g")

barGroup
  .append("rect")
      .attr("class","bar")
      .attr("x",function(d) { return xScale(d.year); })
      .attr("y",function(d) { return yScale(d.population) })
      .attr("width",xScale.bandwidth())
      .attr("height",function(d) { return height - yScale(d.population); })
      .on("mouseenter", mouseenter)
      .on("mouseleave", mouseleave)

// barGroup
//   .append('text')
//       .attr('class', 'value')
//       .attr('x', (d) => xScale(d.year) + xScale.bandwidth() / 2)
//       .attr('y', (d) => yScale(d.population) + 30)
//       .attr('text-anchor', 'middle')
//       .text(function(d) { return `${d.population}`; })

// set Y axis label
svg
  .append("text")
    .attr("class", "label")
    .attr("x", -20)
    .attr("y", -(margin.top/4))
    .attr("text-anchor", "start")
  .text("Displaced population (millions)")

// svg
//   .append('text')
//       .attr('class', 'label')
//       .attr('x', width / 2)
//       .attr('y', height + margin.bottom/1.6)
//       .attr('text-anchor', 'middle')
//       .text('Years')

svg
  .append('text')
      .attr('class', 'title')
      .attr('x', -20)
      .attr('y', -(margin.top/1.5))
      .attr('text-anchor', 'start')
      .text('Refugee in protracted situation | 2009-2016')

svg
  .append('text')
      .attr('class', 'source')
      .attr('x', width)
      .attr('y', height + margin.bottom/1.3)
      .attr('text-anchor', 'end')
      .text('Source: UNHCR, 2016')



})
