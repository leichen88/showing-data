// initialize margin, width and height
const margin = 150;
const width = 600;
const height = 600;

// radius is half of the width or height
const radius = Math.min(width, height) / 2 - margin

// create svg container
const svg = d3.select("#d3-container-3")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", `translate(${width/2.3}, ${height/2})`)

// parse the data
d3.csv("data/donut-chart.csv", function(d){
    return {
        poc: d["People of Concern"],
        population: +d.Population  
    };
}).then(function(data){
console.log(data)

const pieKey = d3.map(data, function(d) { return d.poc}).keys()
console.log(pieKey)
// const pieKey2 = data.map(function(d) { return d.poc; })
// console.log(pieKey2)


// set pie value and position using generator
const pieData = d3.pie().value(function(d) { return d.population})
(data)
console.log(pieData)

const arcGenerator = d3.arc()
    .innerRadius(80)
    .outerRadius(radius)

const labelArcs = d3.arc()
    .innerRadius(radius*1.23)
    .outerRadius(radius*1.23)

// set the color
const color = d3.scaleOrdinal()
    .domain(pieKey)
    .range(["#6a696b", "#c0bebf", "#929092"])

// create pie chart
svg
    .selectAll("slices")
    .data(pieData)
    .enter()
    .append("path")
        .attr("fill", function(d) { return color(d.data.poc); })
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 2)
        .attr("d", arcGenerator)

// set labels for slices
const text = svg.append('g')
    .attr('class', 'labels-container')
    .attr('transform', `translate(${width},${height/0})`)
    .selectAll("text")
    .data(pieData)
    .join("text")
    .attr('transform', d => `translate(${labelArcs.centroid(d)})`)
    .attr('text-anchor', 'middle')
    
    text.selectAll("tspan")
        .data(d => [ 
            d.data.poc, 
            d.data.population + ' millions' 
          ])
        .join("tspan")
        .attr("class", "label")
        .attr('x', 0)
        .style('font-weight', (d,i) => i ? undefined : 'bold')
        .attr('dy', (d,i) => i ? '1.2em' : 0 )
        .text(d => d)




// set chart title
svg
    .append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -height/2 + margin/2)
        .attr("text-anchor", "middle")
    .text("Population of concern to UNHCR | end of 2016")


// set data source
svg
    .append("text")
        .attr("class", "source")
        .attr("x", width/2)
        .attr("y", height/2 - margin/2)
        .attr("text-anchor", "end")
    .text("Source: UNHCR, 2016")


// // set total value
svg
// const total = svg.append('g')
// .attr('class', 'total')
// .selectAll("text")
// .data(pieData)
// .join("text")
// .attr('text-anchor', 'middle')

// total.selectAll("tspan")
//     .data(d => [ 
//         "Total population", 
//         d.data.population + ' millions' 
//       ])
//     .join("tspan")
//     .attr("class", "label-total")
//     .attr('x', 0)
//     .style('font-weight', (d,i) => i ? undefined : 'bold')
//     .attr('dy', (d,i) => i ? '1.2em' : 0 )
//     .text(d => d)




})