// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 120,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select id="scatter", append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Set initial parameters of x and y aixs
var selectedX = "poverty";
var selectedY = "healthcare";

// Update the labels with state abbreviations
function renderText(textGroup, newXScale, selectedX, newYScale, selectedY) {
  textGroup.transition()
    .duration(2000)
    .attr("x", d => newXScale(d[selectedX]))
    .attr("y", d => newYScale(d[selectedY]))
  return textGroup;
}
// Load data from data.csv
d3.csv("./assets/data/data.csv").then(function(censusData) {

    console.log(censusData);
  
    // Parse data
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create a scale for x and y, respectively
    var xLinearScale = xScale(censusData, selectedX);
    var yLinearScale = yScale(censusData, selectedY);

    // Create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // Append circles to data points
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[selectedX]))
        .attr("cy", d => yLinearScale(d[selectedY]))
        .attr("r", 12)
        .attr("opacity", 0.9);

    // Create circle labels
    var textGroup = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[selectedX]) )
        .attr("y", d => yLinearScale(d[selectedY]))
        .attr('dy', 3)
        .attr("font-size", 12)
        .text(d => d.abbr);

    
  }).catch(function(error) {
    console.log(error);
  });