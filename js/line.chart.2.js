// parse the data
d3.csv("data/line-chart-2.csv").then(function(data){

const parseTime = d3.timeParse("%Y")
const slices = data.columns.slice(1).map(function(id){
    return {
        id: id,
        values: data.map(function(d){
            return {
                date: parseTime(d.Year),
                measurement: +d[id]
            };
        })
    };
});

// initialize margin, width and height
const margin = {top: 80, right: 20, bottom: 70, left: 40};
const width = 450 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

// create svg container
const svg = d3.select("#d3-container-2")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 450 350")
        .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

console.log("Column headers", data.columns);
console.log("Column headers without date", data.columns.slice(1));
// returns the sliced dataset
console.log("Slices",slices);  
// returns the first slice
console.log("First slice",slices[0]);
// returns the array in the first slice
console.log("A array",slices[0].values);   
// returns the date of the first row in the first slice
console.log("Date element",slices[0].values[0].date);  
// returns the array's length
console.log("Array length",(slices[0].values).length);

// const lineData = d3.nest()
//     .key(function(d) { return d.name})
//     .entries(data)
// console.log(lineData)


// X sacle and axis
const xScale = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return parseTime(d.Year); }))
    .range([0, width]);
svg
    .append("g")
        .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y')));

// Y scale and axis
const yScale = d3.scaleLinear()
    .domain([0, d3.max(slices, function(c) { 
        return d3.max(c.values, function(d) {
            return d.measurement; })})]).nice()
    .range([height,0]);
svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(0).tickPadding(6).ticks(null, "s"))
    .call(function(g) { return g.select(".domain").remove()})


// create horizontal grid line
const yGridLine = function() { return d3.axisLeft()
    .scale(yScale)};
svg
    .append("g")
        .attr("class", "grid")
    .call(yGridLine()
        .tickSize(-width,0,0)
        .tickFormat('')
    );

// color palette
var res = slices.map(function(d){ return d.id }) // list of group names
var color = d3.scaleOrdinal()
  .domain(res)
  .range(['#f1866b','#aadcd9','#6f7eb8','#ffd17e'])


// create tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// create the line
const lines = svg
    .selectAll("lines")
    .data(slices)
    .enter()
    .append("g");
    
lines.append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.id) })
        .attr("stroke-width", 2)
        .attr("d", function(d) {
            return d3.line()
            .defined(function(d) { return d.measurement != 0; }) // show missing values as null instead of zero
            .curve(d3.curveCardinal)
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.measurement); })
            (d.values)
        });

// lines.append("text")
//     .attr("class","serie_label")
//     .datum(function(d) {
//         return {
//             id: d.id,
//             value: d.values[d.values.length - 1]}; })
//     .attr("transform", function(d) {
//             return "translate(" + (xScale(d.value.date) + 10)  
//             + "," + (yScale(d.value.measurement) + 5 )+ ")"; })
//     .attr("x", 5)
//     .text(function(d) { return d.id; });


// events
lines.selectAll("circles")
    .data(function(d) { return(d.values); } )
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.date); })      
    .attr("cy", function(d) { return yScale(d.measurement); })    
    .attr('r', 10)
    .style("opacity", 0)
    .on('mouseover', function(d) {
        tooltip.transition()
            .delay(30)
            .duration(200)
            .style("opacity", 1);
        
        const formatValue = d3.format(",")
        const formatDate = d3.timeFormat('%Y')
        
        tooltip.html(formatDate(d.date) + ": " + formatValue(d.measurement))
        .style("left", (d3.event.pageX + 20) + "px")
        .style("top", (d3.event.pageY) + "px");  

    const selection = d3.select(this).raise();

    selection
        .transition()
        .delay("20")
        .duration("200")
        .attr("r", 4)
        .style("opacity", 1)
        .style("fill","#ed3700");
})

    .on("mouseout", function(d) {      
        tooltip.transition()        
        .duration(100)      
        .style("opacity", 0);   

    const selection = d3.select(this);

    selection
        .transition()
        .delay("20")
        .duration("200")
        .attr("r", 6)
        .style("opacity", 0);
    });


// set chart title
svg
    .append("text")
        .attr("class", "title")
        .attr("x", -35)
        .attr("y", -(margin.top/2))
        .attr("text-anchor", "start")
    .text("Trend of population of concern to UNHCR | 1951 - 2019")

// set Y axis label
svg
    .append("text")
        .attr("class", "label")
        .attr("x", -35)
        .attr("y", -(margin.top/5))
        .attr("text-anchor", "start")
    .text("Population (millions)")

// set data source
svg
    .append("text")
        .attr("class", "source")
        .attr("x", width + 10)
        .attr("y", height + margin.bottom/2)
        .attr("text-anchor", "end")
    .text("Source: UNHCR, 2019")

// set legend manually 
svg
    .append("circle")
        .attr("cx", 105)
        .attr("cy", -(margin.top/5))
        .attr("r", 5)
        .style("fill", "#6f7eb8");
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 115)
        .attr("y", -(margin.top/5))
        .attr("alignment-baseline","middle")
    .text("IDPs")


svg
    .append("circle")
        .attr("cx", 155)
        .attr("cy", -(margin.top/5))
        .attr("r", 5)
        .style("fill", "#f1866b")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 165)
        .attr("y", -(margin.top/5))
        .attr("alignment-baseline","middle")
    .text("Refugees")


svg
    .append("circle")
        .attr("cx", 235)
        .attr("cy", -(margin.top/5))
        .attr("r", 5)
        .style("fill", "#ffd17e")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 245)
        .attr("y", -(margin.top/5))
        .attr("alignment-baseline","middle")
    .text("Sateless")


svg
    .append("circle")
        .attr("cx", 305)
        .attr("cy", -(margin.top/5))
        .attr("r", 5)
        .style("fill", "#aadcd9")
svg
        .append("text")
            .attr("class", "legend")
            .attr("x", 315)
            .attr("y", -(margin.top/5))
            .attr("alignment-baseline","middle")
        .text("Asylum-seeker")




})