
const series = [
  {
    'date': Date.parse('2024-03-12'),
    'graph': {
      'nodes': [
        {id: "ЗАКОН 1", radius: 15},
        {id: "ЗАКОН 1_параграф 1", radius: 10},
        {id: "ЗАКОН 1_параграф 2", radius: 10},
        {id: "ЗАКОН 1_параграф 1_алинея 1", radius: 5},
        {id: "ЗАКОН 1_параграф 2_алинея 1", radius: 5},
      ],
      'links': [
        {source: "ЗАКОН 1", target: "ЗАКОН 1_параграф 1"},
        {source: "ЗАКОН 1", target: "ЗАКОН 1_параграф 2"},
        {source: "ЗАКОН 1_параграф 1", target: "ЗАКОН 1_параграф 1_алинея 1"},
        {source: "ЗАКОН 1_параграф 2", target: "ЗАКОН 1_параграф 2_алинея 1"},
      ]
    }
  },
  /*
  {
    'date': Date.parse('2024-03-13'),
    'graph': {
      'ЗАКОН 1': ['параграф 1', 'параграф 2'],
      'параграф 1': ['алинея 1', 'алинея 2'],
      'параграф 2': ['алинея 1'],
    }
  },
  {
    'date': Date.parse('2024-03-14'),
    'graph': {
      'ЗАКОН 1': ['параграф 1', 'параграф 2', 'параграф 3'],
      'параграф 1': ['алинея 1', 'алинея 2'],
      'параграф 2': ['алинея 1'],
      'параграф 3': ['алинея 1'],
    }
  },
  */
]


let promise = fetch('/public/2002-01-30.0.json')
  .then(response => response.text())
  .then(text => {
    visualize(JSON.parse(text))
  })

let newspaper = series[0].graph;
console.log(newspaper);

function visualize(newspaper) {
    let nodes = newspaper.nodes;
    let links = newspaper.lines;
    
    console.log(nodes, links)
    nodes.push({id: nodes.length, line: 'law', weight: -1})

    let simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
      .force('link', d3.forceLink().links(links).id(d => d.line).distance(100))
      .on('tick', ticked);

    function dragstarted(event, d) {
        
        d3.select(this).raise().attr("stroke", "black");
    }
    /*
    setInterval(() => {
        neighbours_count+=1;
        nodes.push({
            x : nodes[0].x + radius * Math.cos(2 * Math.PI * neighbours_count / 10),
            y: nodes[0].y + radius * Math.sin(2 * Math.PI * neighbours_count / 10),
            radius: 5
        });
        links.push({source: 0, target: neighbours_count});

        simulation
        .nodes(nodes)
        .force('link')
        .links(links)
        simulation.alphaTarget(0.01).restart();
    }, 10000)
    */

    function dragged(event, d) {
        d.px += event.dx;
        d.py += event.dy;
        d.x += event.dx;
        d.y += event.dy; 
        if(d.main == 1) {

        }
        ticked();
    }

    function dragended(event, d) {
        if (!event.active) {
            console.log('asd')
            simulation.alphaTarget(0.01).restart()
        };
        d.fixed = true; 
        ticked();
    }

    let drag = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)

    let zoom = d3.zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', handleZoom);

    function handleZoom(event, d) {
        simulation.stop();
        console.log(event)
        d3.selectAll('circle, g, text')
          .attr("transform", event.transform);
        simulation.restart();
    }

    const svg_el = document.querySelector('#visualization');
    svg_el.setAttribute('width', window.innerWidth);
    svg_el.setAttribute('height', window.innerHeight);

    const links_el = document.createElement('g');
    links_el.className = "links";
    svg_el.appendChild(links_el);

    let svg = d3.select('svg');

    svg.call(zoom)//.attr("transform","translate(100,50)scale(.5,.5)"); ;

    let circles = svg
      .selectAll('circle')
      .data(nodes)
      .join('circle')


    let g = d3.select('.links')
    .selectAll('line')
    .data(links)
    .join('line');

    var label = svg.selectAll(".labels")
                .data(nodes)
                .enter()
                .append("text")
                  .text(function (d) { return d.line.substr(0, 20) })
                  .style("text-anchor", "middle")
                  .style("fill", "#555")
                  .style("font-family", "Arial")
                  .style("font-size", 12);

      //d3.selectAll('circle, g, text')
      //  .attr("transform", event.transform);
      d3.selectAll('circle, g, text')
      .attr("transform", "translate(200, 200),scale(.15,.15)");
    function ticked() {

      circles
            .attr('r', function(d) {
                return 25 - (d.weight * 4)
            })
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            })
            .call(drag);

        g
        .attr('x1', function(d) {
          return d.source.x
        })
        .attr('y1', function(d) {
          return d.source.y
        })
        .attr('x2', function(d) {
          return d.target.x
        })
        .attr('y2', function(d) {
          return d.target.y
        });

      label.attr("x", function(d){ return d.x; })
        .attr("y", function (d) {return d.y - 10; }) 
    }
}

