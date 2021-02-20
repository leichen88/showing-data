// parse the data
d3.csv("area_chart.csv", function(d) { 
    return {
        year: new Date(+d.Year, 0, 1),
        refugee: + d.Refugee
    };
}).then(function(data){

// initialize margin, width and height
const margin = {top: 80, right: 20, bottom: 50, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// create svg container
const svg = d3.select("#d3-container-3")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100")
        .attr("viewBox","0 0  600 400")
        .attr("preserveAspectRatio","xMinYMin")
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

// X sacle and axis
const xScale = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([0, width]);
svg
    .append("g")
        .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))

// Y scale and axis
const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.refugee; })]).nice()
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

// create the area
svg
    .append("path")
    .datum(data)
        .attr("fill", "#66AAD7")
        .attr("d", d3.area()
            .x(function(d) { return xScale(d.year)})
            .y0(yScale(0))
            .y1(function(d) { return yScale(d.refugee)})
            );

// set chart title
svg
    .append("text")
        .attr("class", "title")
        .attr("x", -35)
        .attr("y", -(margin.top/2))
        .attr("text-anchor", "start")
    .text("Trend of population of refugee | 1951-2019")

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

})