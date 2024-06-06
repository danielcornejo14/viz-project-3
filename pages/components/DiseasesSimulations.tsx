"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
}

const DiseasesSimulation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://viz-project-3.netlify.app/.netlify/functions/diseases-simulation'); // Adjust this URL to your Netlify function URL if needed
      const { nodes, links }: { nodes: Node[]; links: Link[] } = await response.json();
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
        const svg = d3.select(svgRef.current);
        const width = 1000;
        const height = 1000;

        svg.attr('width', width).attr('height', height);
        const group = svg.append('g');

        group.selectAll('line')
          .data(links)
          .enter()
          .append('line')
          .attr('x1', d => nodes.find(node => node.id === d.source)?.x || 0)
          .attr('y1', d => nodes.find(node => node.id === d.source)?.y || 0)
          .attr('x2', d => nodes.find(node => node.id === d.target)?.x || 0)
          .attr('y2', d => nodes.find(node => node.id === d.target)?.y || 0)
          .attr('stroke', '#999')
          .attr('stroke-width', 2);

        // Render nodes
        const node = group.selectAll('circle')
          .data(nodes)
          .enter()
          .append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', 5)
          .attr('fill', 'steelblue');

        // Add zoom and pan functionality
        const zoom = d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.1, 4])
          .on('zoom', (event) => {
            group.attr('transform', event.transform);
          });

        svg.call(zoom);

        // Add brush functionality
        const brush = d3.brush()
          .extent([[0, 0], [width, height]])
          .on('start brush', (event) => {
            const selection = event.selection;
            if (selection) {
              const [[x0, y0], [x1, y1]] = selection;
              node.classed('selected', (d: any) => {
                return x0 <= d.x && d.x <= x1 && y0 <= d.y && d.y <= y1;
              });
            }
          });

        svg.append('g')
          .attr('class', 'brush')
          .call(brush);
      }


    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Disease Graph</h1>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DiseasesSimulation;