"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  x: number;
  y: number;
}

const DiseasesSimulation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      
      const response = await fetch('https://viz-project-3.netlify.app/data/diseases.json'); // Adjust this URL to your Netlify function URL if needed
      const nodes: Node[] = await response.json();
      console.log(nodes)
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        const width = 1000;
        const height = 1000;

        svg.attr('width', width).attr('height', height);

        svg.selectAll('circle')
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