// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 600;
var svgHeight = 440;

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 70
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(newsData) {

  // Throw an error if one occurs -- does not work for this data set. 
  // When I tried to include an error warning, I received an Uncaught (in promise) error in the console.
  // if (error) throw error;

  // Print the newsData
  console.log(newsData);

  // Format the date and cast the news value to a number
  newsData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Configure an x scale
  var xScale = d3.scaleLinear()
    .domain([8, d3.max(newsData, d => d.poverty)])
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yScale = d3.scaleLinear()
    .domain([d3.min(newsData, d => d.healthcare)-1, d3.max(newsData, d => d.healthcare)+1])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // Append an SVG group element to the chartGroup, create the left axis inside of it
  chartGroup.append("g")
    .call(leftAxis);

  // Append an SVG group element to the chartGroup, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Append circle for each data point
  var dataGroup = chartGroup.selectAll("circle")
    .data(newsData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "10")
    .attr("opacity", ".7")

  // Append labels for each State point
  var stateLabels = chartGroup.selectAll()
    .data(newsData)
    .enter()
    .append("text")
    .text(data => data.abbr)
    .attr("class", "stateText")
    .attr("x", data => xScale(data.poverty))
    .attr("y", data => yScale(data.healthcare)+3);

  // Append axes labels
  chartGroup.append("text")
    .attr("transform", `translate(${svgWidth/2}, ${chartHeight + margin.top + 10})`)
    .style("text-anchor", "middle")
    .text("In Poverty (%)")
    .attr("class", "aText")

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (svgHeight / 2))
    .attr("class", "aText")
    .text("Lacks Healthcare (%)");
});