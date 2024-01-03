function onLoad(){
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v5.min.js';
    document.head.appendChild(script);

    script.onload = function () {
        fetch('/main/players')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let table = d3.select("body").append("table");

                let defaultHeaders = ['Name','Age','Nationality', 'National_Position', 'Club', 'Height', 'Preffered_Foot','Preffered_Position']

                let filteredHeaders = defaultHeaders.filter(header => Object.keys(data[0]).includes(header));

                let headers = table.append("thead").append("tr");
                headers.selectAll("th")
                    .data(filteredHeaders)
                    .enter().append("th")
                    .text(function (d) {
                        return d;
                    })
                    .style("border", "1px solid #ddd") // Add border styles inline
                    .style("padding", "8px")
                    .append("span")
                    .attr("class", "delete-icon")
                    .html("&nbsp;<i class='fa fa-close' style='color: red'></i>")
                    .on("click", function (header) {
                        deleteColumn(header);
                    });

                let rows = table.append("tbody").selectAll("tr")
                    .data(data)
                    .enter().append("tr");

                rows.selectAll("td")
                    .data(function (d) {
                        return filteredHeaders.map(header => d[header]);
                    })
                    .enter().append("td")
                    .text(function (d) {
                        return d;
                    });

                barPlot(data);

                function deleteColumn(columnName) {
                    var indexToDelete = headers.selectAll("th").data().indexOf(columnName);

                    headers.selectAll("th")
                        .filter(function(d, i) {
                            return i === indexToDelete;
                        })
                        .remove();

                    rows.selectAll("td")
                        .filter(function(d, i) {
                            return i === indexToDelete;
                        })
                        .remove();
                }

            })
            .catch(error => {
                console.error(error.message);
            });

    };
}

function barPlot(data) {
    var dataset = data;

    var svgWidth = 800, svgHeight = 500, barPadding = 5;
    var barWidth = svgWidth / dataset.length;

    var svg = d3.select('body')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    var barChart = svg.selectAll('g')
        .data(dataset)
        .enter()
        .append('g');

    barChart.append('rect')
        .attr('x', function(d, i) {
            return i * (barWidth + barPadding);
        })
        .attr('y', function(d) {
            return svgHeight - d.Acceleration;
        })
        .attr('width', barWidth)
        .attr('height', function(d) {
            return d.Acceleration;
        })
        .attr('fill', 'red');

    barChart.append('rect')
        .attr('x', function(d, i) {
            return i * (barWidth + barPadding);
        })
        .attr('y', function(d) {
            return svgHeight - d.Speed - d.Acceleration;
        })
        .attr('width', barWidth)
        .attr('height', function(d) {
            return d.Speed;
        })
        .attr('fill', 'green');

    barChart.append('rect')
        .attr('x', function(d, i) {
            return i * (barWidth + barPadding);
        })
        .attr('y', function(d) {
            return svgHeight - d.Stamina - d.Speed - d.Acceleration;
        })
        .attr('width', barWidth)
        .attr('height', function(d) {
            return d.Stamina;
        })
        .attr('fill', 'blue');

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {
            return d.Acceleration + d.Speed + d.Stamina;
        })])
        .range([svgHeight, 0]);

    var yAxis = d3.axisLeft().scale(yScale);

    svg.append('g')
        .call(yAxis);

    // Y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0)
        .attr('x', 0 - svgHeight / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Readings');
}
