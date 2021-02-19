// parse the data
d3.csv("data/line-chart.csv", function(d) { 
    return {
        date: new Date(+d.Date, 0, 1),
        value: + d.Value
    };
}).then(function(data){

// initialize margin, width and height
const margin = {top: 80, right: 20, bottom: 70, left: 40};
const width = 450 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

// create svg container
const svg = d3.select("#d3-container-1")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 450 350")
        .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

// X sacle and axis
const xScale = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([0, width]);
svg
    .append("g")
        .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y')));

// Y scale and axis
const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.value; })]).nice()
    .range([height,0])
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

// find the X index of the mouse
const bisect = d3.bisector(function(d) { return d.date}).left;

// create the circle on the curve
const focus = svg
    .append("g")
    .append("circle")
        .style("fill", "steelblue")
        .attr("stroke", "steelblue")
        .attr("r", 3)
        .style("opacity", 0)

// create the text on the curve
const focusText = svg
    .append("g")
    .append("text")
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")

const mouseover = function() {
    focus.style("opacity", 1)
    focusText.style("opacity",1)
};

const formatValue = d3.format(",")

const mousemove = function() {
const x0 = xScale.invert(d3.mouse(this)[0]);
const i = bisect(data, x0, 1);
selectedData = data[i]
focus
    .attr("cx", xScale(selectedData.date))
    .attr("cy", yScale(selectedData.value))
focusText
    .html("Number of Refugees: " + formatValue(selectedData.value))
    .attr("x", xScale(selectedData.date)+15)
    .attr("y", yScale(selectedData.value))
};

const mouseout = function() {
focus.style("opacity", 0)
focusText.style("opacity", 0)
};


// create the line
svg
    .append("path")
    .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ffd17e")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return xScale(d.date)})
            .y(function(d) { return yScale(d.value)})
            );

//create a rect on the svg
svg
    .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);


// set chart title
svg
    .append("text")
        .attr("class", "title")
        .attr("x", -35)
        .attr("y", -(margin.top/2))
        .attr("text-anchor", "start")
    .text("Trend of refugee population | 1951 - 2019")

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