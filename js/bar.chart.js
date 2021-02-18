// set the dimensions and margins of the graph
const margin = {top: 50, right:20, bottom: 40, left: 80};
const width = 450 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

// create svg container
const svg = d3.select("#d3-container-3")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('viewBox','0 0  450 350')
        .attr('preserveAspectRatio','xMinYMin')
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

// parse the data
d3.csv("data/bar-chart.csv", function(d) {
    return {
        country: d.country,
        population: +d.population
    }
}).then(function(data) {


// set X scale and axis
const xScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.population})).nice()
    .range([0, width]);
svg
    .append("g")
        .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickValues([]))
    .call(function(d) { return d.select(".domain").remove()});

// set Y scale and axis
const yScale = d3.scaleBand()
    .domain(data.map(function(d) { return d.country; }))
    .range([0, height])
    .padding(.25);
svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(0).tickPadding(6))
    .call(function(d) { return d.select(".domain").remove()});


// set events
const mouseenter = function(d) {
    d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", ".5")
        .attr("y", function(d) { return yScale(d.country)-3})
        .attr("height", yScale.bandwidth() + 6)
};
const mouseleave = function(d) {
    d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
        .attr("y", function(d) { return yScale(d.country)})
        .attr("height", yScale.bandwidth())
};


// create bar group
const barGroup = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("g");

barGroup
    .append("rect")
        .attr("class", "bar")
        .attr("x", xScale(0))
        .attr("y", function(d) { return yScale(d.country); })
        .attr("width", function(d) { return xScale(d.population); })
        .attr("height", yScale.bandwidth())
        .on("mouseenter", mouseenter)
        .on("mouseleave", mouseleave);



// set value label on the bars
barGroup
    .append("text")
        .attr("class", "value")
        .attr("x", function(d) { return xScale(d.population)-5; })
        .attr("y", function(d) { return yScale(d.country) + yScale.bandwidth()/1.5; })
        .attr("text-anchor", "end")
    .text(function(d) { return `${d.population}`; })
    // .call(function(text) { return text.filter(function(d) { xScale(d.population) - xScale(0) < 20})})
    //     .attr("class", "value_2")
    //     .attr("dx", +4)
    //     .attr("fill", "black")
    //     .attr("text-anchor", "start");


// set chart title
svg
    .append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -(margin.top / 2))
        .attr("text-anchor", "start")
    .text("Number of refugees per 1,000 inhabitants | end-2016*");


// set data source
svg
    .append("text")
        .attr("class", "source")
        .attr("x", width)
        .attr("y", height + margin.bottom/2)
        .attr("text-anchor", "end")
    .text("Source: UNHCR, 2016");


// set footnote
svg
    .append("text")
        .attr("class", "note")
        .attr("x", -(margin.left/1.1))
        .attr("y", height + margin.bottom/2)
        .attr("text-anchor", "start")
    .text("*Only country with national populations over 100,000 were considered");

    
})