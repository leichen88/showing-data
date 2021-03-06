// Parse data
d3.csv("data/chart-category.csv", function(d){
  return {
    category: d.category,
    name: d.name,
    size: +d.size
  }
}).then(function(nodeData){

// sort the nodes so that the bigger ones are at the back
nodeData = nodeData.sort(function(a,b){ return b.size - a.size; });

console.log(nodeData)

//set svg
const width = 960,
      height = 450,
      sizeDivisor = 100,
      nodePadding = 2.5;


const svg = d3.select("#container")
            .append("svg")
              .attr("width", "100%")
              .attr("height", "100%")
              .attr("viewBox","0 0  960 450")
              .attr("preserveAspectRatio","xMinYMin");


const color = d3.scaleOrdinal(["#c0b6cd", "#c0bebf", "#d8f8d9", "#f9c7ff", "#fbd3c3", "#ffedcf","#e1f2f0","#c6cae4"]); 
const radius = Math.random() * 10;


// create a tooltip
const tooltip = d3.select("body")
  .append("div")
    .attr("class", "tooltip");
  

// Three function that change the tooltip when user hover / move / leave a cell
const mouseover = function(d) {
  tooltip
      .style("opacity", 1)
  d3.select(this)
      .style("stroke", "#e82c2a")
      .style("stroke-width", 3)
      .style("opacity", .5)
}

const mousemove = function(d) {
  tooltip
  .html("<div>" + d.name + "</div><div><span style='color:#98a0cc'> "+ d.category)
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



const simulation = d3.forceSimulation()
                   .nodes(nodeData)
                   
                   .force("forceX", d3.forceX().strength(.1).x(width / 2))
                   .force("forceY", d3.forceY().strength(.1).y(height / 2))
                   .force("center", d3.forceCenter().x(width / 2).y(height / 2))
                   .force("charge", d3.forceManyBody().strength(1))
                   .force("collide",d3.forceCollide(20).strength(1))
                   .on("tick", function(d){
                    node
                        .attr("cx", function(d){ return d.x; })
                        .attr("cy", function(d){ return d.y; })
                  });

const node = svg
            .append("g")
              .attr("class", "node")
            .selectAll("circle")
            .data(nodeData)
            .enter()
            .append("circle")
              .attr("r", 15)
              .attr("fill", function(d) { return color(d.category); })
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
            .call(d3.drag()
             .on("start", dragstarted)
             .on("drag", dragged)
             .on("end", dragended))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
            
            

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(.03).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(.03);
  d.fx = null;
  d.fy = null;
}

})


