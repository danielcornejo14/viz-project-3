import { Handler } from '@netlify/functions'
import * as d3 from 'd3'

export const handler: Handler = async (event, context) => {
  const docResponse = await fetch(process.env.URL + '/data/diseases.json')
  const data = await docResponse.json()

  const nodes = data.nodes
  .map((node: any) => ({
    id: node.key,
    ...node.attributes
  }));

  const links = data.edges
  .map((edge: any) => ({
    source: edge.source,
    target: edge.target
  }));

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d: any) => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(500, 500))
    .stop();

  for (let i = 0; i < 300; ++i) simulation.tick();

  const simulationNodes = simulation.nodes().map((node: any) => ({
    id: node.id,
    name: node.label,
    x: node.x,
    y: node.y
  }));

  const simulationLinks = links.map((link: any) => ({
    source: link.source.id,
    target: link.target.id
  }));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ nodes: simulationNodes, links: simulationLinks })
  }
}