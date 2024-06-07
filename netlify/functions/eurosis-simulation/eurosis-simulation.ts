import { Handler } from '@netlify/functions'
import * as d3 from 'd3'

export const handler: Handler = async (event, context) => {
  try {
    const docResponse = await fetch(process.env.URL + '/data/eurosis.json')
    const data = await docResponse.json()

    const nodes = data.nodes.map((node: any) => ({
      id: node.key,
      ...node.attributes
    }));

    const links = data.edges.map((edge: any) => ({
      source: edge.source,
      target: edge.target
    }));

    // Initialize the simulation with nodes and links
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(500, 500))
      .stop();

    // Run the simulation for a set number of iterations
    for (let i = 0; i < 300; ++i) simulation.tick();

    // Extract the final positions of the nodes
    const simulationNodes = simulation.nodes().map((node: any) => ({
      id: node.id,
      ...node,
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
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error})
    }
  }
}