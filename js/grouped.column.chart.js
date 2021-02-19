// initialize margin, width and height
const margin = {top: 80, right: 20, bottom: 50, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// create svg container
const svg = d3.select("#d3-container-3")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox","0 0  600 400")
        .attr("preserveAspectRatio","xMinYMin")
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

// parse the data
d3.csv("data/grouped-column-chart.csv").then(function(data) {

// list of value keys
const keys = data.columns.slice(1);

// list of first column values
const years = d3.map(data, function(d) { return d.year }).keys();

// X scale and axis
const xScale = d3.scaleBand()
    .domain(years)
    .range([0, width])
    .padding(.2);
svg
    .append("g")
        .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale)
        .tickSize(0)
        .tickPadding(8)
    )

// Y scale and axis
const yScale = d3.scaleLinear()
    .domain([0, 450])
    .range([height, 0]);
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

// scale for value keys
const xKeyValues = d3.scaleBand()
    .domain(keys)
    .range([0, xScale.bandwidth()])
    .padding([0.05])

// set color palette for different keys
const color = d3.scaleOrdinal()
    .domain(keys)
    .range([ "#c6cae4","#98a0cc","#6f7eb8",])

// create the tooltip
const tooltip = d3.select("body")
    .append("div")
        .attr("class", "tooltip");

// three function that change the tooltip when user hover / move / leave
const mouseover = function(d) {
    tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "#EF4A60")
        .style("opacity", .5)
}

const mousemove = function(d) {
    const format = d3.format(".0f");
    tooltip
    .html("<div>"+d.key+"</div><div><span style='color:red'> "+ d3.format(".0f")(d.value) +" thousands</div>")
    .style("top", d3.event.pageY - 10 + "px")
    .style("left", d3.event.pageX + 10 + "px");
}

const mouseleave = function(d) {
    tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
}


// bars
svg
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
        .attr("transform", function(d) { return `translate(${xScale(d.year)}, 0)` ; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter()
    .append("rect")
        .attr("x", function(d) { return xKeyValues(d.key); })
        .attr("y",function(d) { return yScale(d.value); })
        .attr("width",xKeyValues.bandwidth())
        .attr("height", function(d) { return height - yScale(d.value); })
        .attr("fill", function(d) { return color(d.key)})
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


// set chart title
svg
    .append("text")
        .attr("class", "title")
        .attr("x", -30)
        .attr("y", -(margin.top / 2))
        .attr("text-anchor", "start")
    .text("Main country of origin for new asylum-seekers | 2013 - 2016")

// set data source
svg
    .append("text")
        .attr("class", "source")
        .attr("x", width + 10)
        .attr("y", height + margin.bottom/1.3)
        .attr("text-anchor", "end")
    .text("Source: UNHCR, 2016")

// set y axis label
svg
    .append("text")
        .attr("class", "label")
        .attr("x",-30)
        .attr("y", -(margin.top/5))
        .attr("text-anchor", "start")
    .text("Population (thousands)")



})
        

