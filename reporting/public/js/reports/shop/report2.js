// d3.json("js/reports/bank/testdata1.json", function(data){
//     var map = data.map(function(i){return parseInt(i.profit);})
//
//     var histogram = d3.layout.histogram()
//                         .bins(31)
//                         (map)
//
//                         console.log(histogram)
//
// })

d3.json("js/reports/bank/testdata1.json", function(data){
    var width = 800;
    var height = 600;

    var canvas = d3.select('#shopreport2')
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

    var bars = canvas.selectAll("rect")
                    .data(data)
                    .enter()
                        .append("rect")
                        .attr("width", 20)
                        //.attr("height", function(d){return d.profit/40;})
                        .attr("height", 0)
                        .attr("x", function(d,i){return i*30;})
                        .attr("y", function(d,i){return 600-d.profit/40;})
                        .attr("fill",'blue')
                        .transition()
                            .duration(1500)
                            .delay(500)
                            .attr("height", function(d){return d.profit/40;})

    // canvas.selectAll("text")
    //         .data(data)
    //         .enter()
    //             .append("text")
    //             .attr("fill","white")
    //             .attr("y", function(d,i){return i*30+12;})
    //             .text(function(d){return d._id;});
})

// var dataArray = [5,70,20,40,50,80];
// var width = 600;
// var height = 500;
//
// var widthScale = d3.scale.linear()
//                 .domain([0,80])
//                 .range([0,width]);
//
// var color = d3.scale.linear()
//             .domain([0,80])
//             .range(["red","blue"]);
//
// var axis = d3.svg.axis()
//             .ticks(20)
//             .scale(widthScale);
//
// var canvas = d3.select('#bankreport1')
//                 .append("svg")
//                 .attr("width", width)
//                 .attr("height", height)
//                 .append("g")
//                 .attr("transform", "translate(20,0)");
//
// var bars = canvas.selectAll("rect")
//                     .data(dataArray)
//                     .enter()
//                         .append("rect")
//                         //.attr("width", function(d){return widthScale(d);})
//                         .attr("width", 0)
//                         .attr("height", 30)
//                         .attr("fill",function(d){return color(d)})
//                         .attr("y", function(d,i){return i*50})//;
//                         .transition()
//                             .duration(1500)
//                             .delay(500)
//                             .attr("width", function(d){return widthScale(d);})
//
// canvas.append("g")
//         .attr("transform", "translate(0,350)")
//         .call(axis);
