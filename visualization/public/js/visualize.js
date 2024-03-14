
var width = 300, height = 300
var nodes = [{x:100, y:200, radius: 10, main: 1,}]

let radius = 20;

for(let i = 0; i < 10; i++) {
    nodes.push({
        x : nodes[0].x + radius * Math.cos(2 * Math.PI * i / 10),
        y: nodes[0].y + radius * Math.sin(2 * Math.PI * i / 10),
        radius: 5,
    })
}
let links = []; 
for(let i = 0; i < 10; i++) {
    links.push({source: 0, target: i+1});
}



var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-100))
  //.force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', d3.forceLink().links(links))
  .on('tick', ticked);

function dragstarted(event, d) {
    
    d3.select(this).raise().attr("stroke", "black");
}

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

let zoom = d3.zoom()
  .on('zoom', handleZoom);

function handleZoom(e) {
    console.log('asd')
    d3.select('svg g')
    .call(zoom);
}

function ticked() {
    var u = d3.select('svg')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', function(d) {
            return d.radius
        })
        .attr('cx', function(d) {
            return d.x
        })
        .attr('cy', function(d) {
            return d.y
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    var u = d3.select('.links')
		.selectAll('line')
		.data(links)
		.join('line')
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


  
}


