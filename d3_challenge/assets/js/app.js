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

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial parameters of x and y aixs
var selectedX = "poverty";
var selectedY = "healthcare";

// Update the scale for x upon selected parameter
function xScale(censusData, selectedX) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[selectedX]) * 0.85 , d3.max(censusData, d => d[selectedX]) * 1.15])
    .range([0, chartWidth]);
  return xLinearScale;
}

// Update the scale for y upon selected parameter
function yScale(censusData, selectedY) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[selectedY]) * 0.85, d3.max(censusData, d => d[selectedY]) * 1.15])
    .range([chartHeight, 0]);
  return yLinearScale;
}

// Update the labels with state abbreviations
function renderText(textGroup, newXScale, selectedX, newYScale, selectedY) {
  textGroup.transition()
    .duration(2000)
    .attr("x", d => newXScale(d[selectedX]))
    .attr("y", d => newYScale(d[selectedY]))
  return textGroup;
}

// Update circle group
function updateToolTip(selectedX, selectedY, circlesGroup) {
    if (selectedX === "poverty") {
      var xLabel = "Poverty:";
    }
    else if (selectedX === "income") {
      var xLabel = "Median Income: ";
    }
    else {
      var xLabel = "Age:";
    }
    if (selectedY === "healthcare") {
      var yLabel = "No Healthcare: ";
    }
    else if (selectedY === "obesity") {
      var yLabel = "Obesity:";
    }
    else {
      var yLabel = "Smokers:";
    }


// Load data from data.csv
d3.csv("./assets/data/data.csv").then(function(censusData) {

    console.log(censusData);
  
    // Parse data
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.age = +data.age;
    });

    // Create a scale for x and y, respectively
    var xLinearScale = xScale(censusData, selectedX);
    var yLinearScale = yScale(censusData, selectedY);

    // Create create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    
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

    // Append axes titles
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top})`);

    var povertyLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)");
    
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${chartHeight/2})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 20)
        .attr("x", 0)
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");
    
  }).catch(function(error) {
    console.log(error);
  });
