<style>

.x.axis path {
  display: none;
}

</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
<script src="http://d3js.org/d3.v2.js"></script>
<script type="text/javascript">
var networkOutputBinding = new Shiny.OutputBinding();
$.extend(networkOutputBinding, {

  find: function(scope) {
    return $(scope).find('.shiny-network-output');
  },
  renderValue: function(el, data) {
      //remove the old graph
        var svg = d3.select(el).select("svg");

        svg.remove();
        
        $(el).html("");        

  var width = 960,
      height = 900,
      margin = 40,
      maxRadius = (height/2) - margin;

  var formatDate = d3.time.format("%Y-%m-%d"),
    monthNameFormat = d3.time.format("%b");

  var ticks = [-20,-10,0,10,20,30,40];

  var x = d3.scale.linear()
    .domain([-20, 40])
    .range([120, maxRadius]);

  var xAxis = d3.svg.axis()
    .scale(x).orient("left")
    .tickValues([-20,0,20,40])
    .tickFormat(function(d) { return d + "°C"; });

  var r = d3.scale.linear()
    .domain([0,200])
    .range([0, maxRadius/4]);

  var color = d3.scale.linear()
    .domain(ticks)
    .range(["#00375a","#1b6491","#52b7e7","#96d88c","#fbd65f","#e46c56","#9e3b2c"]);

  var svg = d3.select('body').append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  d3.csv(el, function(error, data) {

    data.forEach(function(d) {
      d["date"] = formatDate.parse(d["date"]);
      d["Min TemperatureC"] = +d["Min TemperatureC"];
      d["Max TemperatureC"] = +d["Max TemperatureC"];
      d["Mean TemperatureC"] = +d["Mean TemperatureC"];
      d["Precipitationmm"] = (d["Precipitationmm"] === "T") ? 0 : +d["Precipitationmm"];
    });

    var arc = d3.svg.arc()
      .startAngle(function(d) { return 0; })
      .endAngle(function(d) { return ((2 * Math.PI) / (data.length)); })
      .innerRadius(function(d) { return x(d["Min TemperatureC"]); })
      .outerRadius(function(d) { return x(d["Max TemperatureC"]); });

    var months = d3.map(data, function(d) {
      return monthNameFormat(d["date"]);
    }).keys();

    var monthTicks = svg.append("g")
      .attr("class","monthTicks");

    monthTicks.selectAll(".monthTick")
      .data(months)
     .enter().append("g")
      .attr("class","monthTick")
      .attr("transform", function(d, i) { return "rotate(" + (i * 360 / months.length) + ")"; });
   
    monthTicks.selectAll(".monthTick")
      .append("line")
      .attr("y1", -maxRadius - 5)
      .attr("y2", -maxRadius - 30)
      .style("stroke", "#d6d6d6")
      .style("stroke-width",2);

    monthTicks.selectAll(".monthTick").append("text")
      .attr("x", 8)
      .attr("y", -maxRadius - 15)
      .style("font-size",15)
      .style("fill","#d6d6d6")
      .style("font-family","sans-serif")
      .style("text-anchor", "begin")
      .text(function(d) { return d; });

    var tickCircles = svg.append("g")
      .attr("class","ticksCircle");
      
    tickCircles.selectAll("circle")
      .data(ticks)
     .enter().append("circle")
      .attr("r", function(d) {return x(d);})
      .style("fill", "none")
      .style("stroke", "#d6d6d6")
      .style("stroke-width", function(d,i) { return ((i & 1) === 0) ? 1 : 0.25; });

    var temperatures = svg.selectAll(".temperature")
      .data(data)
     .enter().append("g")
      .attr("class","temperature")
      .attr("transform", function(d, i) { return "rotate(" + (i * 360 / data.length) + ")"; });

    temperatures.append("path")
      .style("stroke", "white")
      .style("stroke-width",1.2)
      .style("fill", function(d) { return color(d["Mean TemperatureC"]); })
      .attr("d", arc);
      
    var precipitations = svg.selectAll(".precipitation")
      .data(data)
     .enter().append("g")
      .attr("class","precipitation")
      .attr("transform", function(d, i) { return "rotate(" + (i * 360 / data.length) + ")"; });

    precipitations.append("circle")
      .attr("cx",0)
      .attr("cy",function(d) { return -x(d["Mean TemperatureC"]); })
      .attr("r", function(d) { return r(d["Precipitationmm"]); })
      .style("opacity", .20)
      .style("fill", "#5c82b9");

    var legend = svg.append("g")
      .attr("class", "legend");

    legend.append("text")
      .attr("dy", ".35em")
      .style("font-size","20px")
      .style("fill","#454545")
      .style("font-family","sans-serif")
      .style("text-anchor", "middle")
      .text("Bombay 2015");

    svg.append("g")
      .attr("class", "x axis")
      .call(xAxis)
     .selectAll("text")
      .style("fill","#454545")
      .style("text-anchor","middle");

  });
  d3.select(self.frameElement).style("height", height + "px");

});

Shiny.outputBindings.register(networkOutputBinding, 'timelyportfolio.networkbinding');

</script>
