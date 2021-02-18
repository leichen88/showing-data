// set the dimensions and margin of the graph
const margin = {top: 50, right: 20, bottom: 50, left: 110};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// create svg container
const svg = d3.select("#d3-container-3")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('viewBox','0 0  600 400')
        .attr('preserveAspectRatio','xMinYMin')
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

// parse the data
d3.csv("data/grouped-bar-chart.csv").then(function(data) {

// get list of subgroup
const subgroups = data.columns.slice(1);

// get list of country names
const countries = d3.map(data, function(d) { return d.country }).keys();

// set X scale and axis
const xScale = d3.scaleLinear()
    .domain([0, 3])
    .range([0, width]);
svg
    .append("g")
    .attr("transform", "translate(0, "+ height +")")
    .call(d3.axisBottom(xScale))
    .call(function(d) { return d.select(".domain").remove()});

// set Y scale and axis
const yScale = d3.scaleBand()
    .domain(countries)
    .range([0,height])
    .padding([.1]);;
svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(0).tickPadding(6))
    .call(function(d) { return d.select(".domain").remove()})

// set bar group scale
const ySubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, yScale.bandwidth()])
    .padding([.05]);

// set bar colors
const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#6f7eb8", "#c6cae4"]);

// create a tooltip
const tooltip = d3.select("body")
        .append("div")
        .attr("id", "chart")
        .attr("class", "tooltip")

const mouseover = function(d) {
    tooltip
      .style("opacity", .8)
    d3.select(this)
      .style("stroke", "#EF4A60")
      .style("opacity", .5)
}

const mousemove = function(d) {
    const format = d3.format(".1f");
    tooltip
    .html("<div>"+d.key+"</div><div><span style='color:red'> "+ d3.format(".2f")(d.value) +" millions</div>")
    .style("top", d3.event.pageY - 10 + "px")
    .style("left", d3.event.pageX + 10 + "px");
}

const mouseleave = function() {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
}


// create bar group
const barGroup = svg.append("g").selectAll("g")
    .data(data)
    .enter()
    .append("g")
        .attr("transform", function(d) { return "translate(0, "+ yScale(d.country)+ ")"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter()
    .append("rect")
        .attr("x", xScale(0))
        .attr("y", function(d) { return ySubgroup(d.key); })
        .attr("width", function(d) { return xScale(d.value)})
        .attr("height", ySubgroup.bandwidth())
        .attr("fill", function(d) { return color(d.key); })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

// set chart title
svg
    .append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -(margin.top / 2))
        .attr("text-anchor", "start")
    .text("Major refugee-hosting countries | 2015 and 2016, (millions) ")

// set data source
svg
    .append("text")
        .attr("class", "source")
        .attr("x", width + 10)
        .attr("y", height + margin.bottom/1.2)
        .attr("text-anchor", "end")
    .text("Source: UNHCR, 2016")

// set X axis label
svg
    .append("text")
        .attr("class", "label")
        .attr("x",-10)
        .attr("y", height + margin.bottom/1.2)
        .attr("text-anchor", "start")
    .text("Displaced population (millions)")

// set legend
const legLabel = ["2015", "2016"];
const legspacing = 22;

const legend = svg
    .selectAll(".legend")
    .data(subgroups)
    .enter()
    .append("g")
        .attr("transform", "translate("+(width - 20)+", "+(height-60)+")");

legend
    .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) { return i*legspacing })
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color);

legend
    .append("text")
        .attr("class", "label")
        .attr("x", -5)
        .attr("y", function(d,i) { return i*legspacing + legspacing/2; })
        .attr("text-anchor", "end")
        .attr("alignment-baseline","middle")
    .text(function(d, i) { return legLabel[i]; });

      


})