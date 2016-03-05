/* Javascript file for word cloud*/

var tags = [{"key": "Human-Computer Interaction", "value": 15},
            {"key": "Information Visualization", "value": 15},
            {"key": "Natural Language Processing", "value": 15},
            {"key": "Cognitive Science", "value": 15},
            {"key": "Data Science", "value": 15},
            {"key": "Machine Learning", "value": 15}];
            
var fill = d3.scale.category20b();
var w = document.getElementById('word-cloud').offsetWidth*0.9;
var h = w/3*2;
var max, fontSize;

var layout = d3.layout.cloud()
        .timeInterval(Infinity)
        .size([w, h])
        .rotate(0)
        .fontSize(function(d) {return fontSize(+d.value);})
        .text(function(d) { return d.key; })
        .on("end", draw);

var svg = d3.select("#word-cloud").append("svg")
        .attr("width", w)
        .attr("height", h);
var vis = svg.append("g")
        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

update();

window.onresize = function(event) { update(); };

function draw(data, bounds) {

    var w = document.getElementById('word-cloud').offsetWidth*0.9;
    var h = w/3*2;

    svg.attr("width", w).attr("height", h);

    scale = bounds ? Math.min(
            w / Math.abs(bounds[1].x - w / 2),
            w / Math.abs(bounds[0].x - w / 2),
            h / Math.abs(bounds[1].y - h / 2),
            h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

    var text = vis.selectAll("text")
            .data(tags, function(d) { return d.text.toLowerCase(); });

    text.transition()
            .duration(1000)
            .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
            .style("font-size", function(d) { return d.size + "px"; });
    text.enter().append("text")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
            .style("font-size", function(d) { return d.size + "px"; })
            .style("opacity", 1e-6)
            .transition()
            .duration(1000)
            .style("opacity", 1);
    text.style("font-family", function(d) { return d.font; })
            .style("fill", function(d) { return fill(d.text.toLowerCase()); })
            .text(function(d) { return d.text; });


    vis.transition().attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
}

function update() {
    layout.font('impact').spiral('archimedean');
    fontSize = d3.scale['sqrt']().range([10, 100]);
    if (tags.length){
        fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
    }
    layout.stop().words(tags).start();
}
