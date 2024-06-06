"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
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
        console.log("nodes:", nodes)
        console.log("links:", links)
        const group = svg.append('g');
        console.log(nodes)
        group.selectAll('circle')
          .data(nodes)
          .enter()
          .append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', 5)
          .attr('fill', 'steelblue');
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