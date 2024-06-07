"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
}

const EurosisSimulation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [interactionMode, setInteractionMode] = useState("zoom");
  const groupRef = useRef<SVGGElement | null>(null);

  const width = 800;
  const height = 800;

  const [node, setNode] = useState<d3.Selection<SVGCircleElement, Node, SVGGElement, unknown>>();
  const [labels, setLabels] = useState<d3.Selection<SVGTextElement, Node, SVGGElement, unknown>>();

  const currentTransform = useRef<d3.ZoomTransform>(d3.zoomIdentity);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://viz-project-3.netlify.app/.netlify/functions/eurosis-simulation'); // Adjust this URL to your Netlify function URL if needed
      const { nodes, links }: { nodes: Node[]; links: Link[] } = await response.json();
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
        const svg = d3.select(svgRef.current);

        svg.attr('width', width).attr('height', height);
        const group = svg.append('g');
        groupRef.current = group.node();

        // Render links
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
        const newNode = group.selectAll('circle')
          .data(nodes)
          .enter()
          .append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', 5)
          .attr('fill', 'steelblue');

        setNode(newNode);

        // Add node labels (initially hidden)
        const newLabels = group.selectAll('text')
          .data(nodes)
          .enter()
          .append('text')
          .text(d => d.label)
          .attr('x', d => d.x + 8) // Slightly offset from the node
          .attr('y', d => d.y + 3)
          .attr('font-size', '10px')
          .attr('stroke', 'black')
          .attr('visibility', 'hidden');

        setLabels(newLabels);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !groupRef.current || !node || !labels) return;

    const svg = d3.select(svgRef.current);
    const group = d3.select(groupRef.current);
    svg.on('.zoom', null); // Clear any previous zoom event listeners
    svg.on('.brush', null); // Clear any previous brush event listeners
    svg.select('.brush').remove(); // Remove previous brush group if any

    if (interactionMode === 'zoom') {
      // Define the zoom behavior
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4]) // Set the zoom scale extent
        .on('zoom', (event) => {
          group.attr('transform', event.transform);
          currentTransform.current = event.transform;
        });

      // Apply the zoom behavior to the SVG element
      svg.call(zoom);
    } else if (interactionMode === 'brush') {
      // Define the brush behavior
      const brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on('start brush', (event) => {
          const selection = event.selection;
          if (selection) {
            const [[x0, y0], [x1, y1]] = selection;
            const [[tx0, ty0], [tx1, ty1]] = [
              [currentTransform.current.invertX(x0), currentTransform.current.invertY(y0)],
              [currentTransform.current.invertX(x1), currentTransform.current.invertY(y1)]
            ];
            node.classed('selected', (d: any) => {
              const isSelected = tx0 <= d.x && d.x <= tx1 && ty0 <= d.y && d.y <= ty1;
              labels.filter((l: any) => l.id === d.id)
                .attr('visibility', isSelected ? 'visible' : 'hidden');
              return isSelected;
            });
          } else {
            labels.attr('visibility', 'hidden');
          }
        })
        .on('end', (event) => {
          if (!event.selection) {
            labels.attr('visibility', 'hidden');
          }
        });

      svg.append('g')
        .attr('class', 'brush')
        .call(brush);
    }
  }, [interactionMode, node, labels]);

  return (
    <div>
      <h1>Eurosis Graph</h1>
      <select onChange={(e) => setInteractionMode(e.target.value)} value={interactionMode}>
        <option value="zoom">Zoom</option>
        <option value="brush">Brush</option>
      </select>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default EurosisSimulation;
