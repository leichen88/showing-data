// initialize margin, width and height
const margin = {top: 100, right: 20, bottom: 50, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// create svg container
const svg = d3.select("#d3-container-3")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 600 400")
        .attr("preserveAspectRatio","xMinYMin")
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
        

// Parse the data
d3.csv("data/full-stacked-column-chart.csv").then(function(data) {


// list of value keys
const keys = data.columns.slice(1);
console.log(keys)

// list of first column value
const countrys = d3.map(data, function(d) { return d.country }).keys()

// X scale and axis
const xScale = d3.scaleBand()
    .domain(countrys)
    .range([0,width])
    .paddingOuter(.01)
    .paddingInner(.2);
svg
    .append("g")
        .attr("transform", "translate(0, "+height+" )")
    .call(d3.axisBottom(xScale)
        .tickSize(0)
        .tickPadding(8)
    )
 
// Y scale and axis
const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);
svg
    .append("g")
    .call(d3.axisLeft(yScale)
        .ticks(10, "%"))
    .call(function(g){ return g.selectAll(".domain").remove() })

// set color palette for different layers
const color = d3.scaleOrdinal()
    .domain(keys)
    .range(["#ffd17e","#d351ff", "#aadcd9", "#f1866b", "#6f7eb8", "#92ec89"])

// stack the data
const stackedData = d3.stack()
    .keys(keys)
    .order(d3.stackOrderDescending)
    .offset(d3.stackOffsetExpand)
    (data)

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

    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName] 
  
    tooltip
    .html(`${subgroupName}:  ${subgroupValue}%`)
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


// Bars
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
        .attr("x", function(d) { return xScale(d.data.country); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]) ; })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

// set title
svg
    .append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -(margin.top/1.5))
        .attr("text-anchor", "start")
    .text("Population of concern to UNHCR by region | end of 2016")

// set data source
svg
    .append("text")
        .attr("class", "source")
        .attr("x", width)
        .attr("y", height + margin.bottom/1.6)
        .attr("text-anchor", "end")
    .text("Source: UNHCR 2016")

// set legend manually 
svg
    .append("rect")
        .attr("x", 0)
        .attr("y", -30)
        .attr("width", 20)
        .attr("height", 15)
        .style("fill", "#6f7eb8");
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 22)
        .attr("y", -20)
        .attr("alignment-baseline","middle")
    .text("IDPs")


svg
    .append("rect")
        .attr("x", 60)
        .attr("y", -30)
        .attr("width", 20)
        .attr("height", 15)
        .style("fill", "#ffd17e")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 82)
        .attr("y", -20)
        .attr("alignment-baseline","middle")
    .text("Refugees")


svg
    .append("rect")
        .attr("x", 148)
        .attr("y", -30)
        .attr("width", 20)
        .attr("height", 15)
        .style("fill", "#aadcd9")  
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 169)
        .attr("y", -20)
        .attr("alignment-baseline","middle")
    .text("Returnees")


svg
    .append("rect")
        .attr("x", 242)
        .attr("y", -30)
        .attr("width", 20)
        .attr("height", 15)
        .style("fill", "#f1866b")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 263)
        .attr("y", -20)
        .attr("alignment-baseline","middle")
    .text("Sateless")


svg
    .append("rect")
        .attr("x", 323)
        .attr("y", -30)
        .attr("width", 20)
        .attr("height", 15)
        .style("fill", "#d351ff")
svg
        .append("text")
            .attr("class", "legend")
            .attr("x", 345)
            .attr("y", -20)
            .attr("alignment-baseline","middle")
        .text("Asylum-seeker")


svg
    .append("rect") 
        .attr("x", 445)
        .attr("y", -30)
        .attr("width", 20)
        .attr("height", 15)
        .style("fill", "#92ec89")
        .classed("rect6", true)
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 466)
        .attr("y", -20)
        .attr("alignment-baseline","middle")
    .text("Others")


})