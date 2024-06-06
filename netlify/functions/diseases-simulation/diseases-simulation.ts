import { Handler } from '@netlify/functions'
import * as d3 from 'd3'

export const handler: Handler = async (event, context) => {
  const docResponse = await fetch(process.env.URL + '/data/diseases.json')
  const data = await docResponse.json()
  
  const nodes = data.nodes.map((node: any) => ({
    id: node.key,
    ...node.attributes
  }));
  
  const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(500, 500))
    .stop();
  
  for (let i = 0; i < 300; ++i) simulation.tick();
  
  const simulationNodes = simulation.nodes().map((node: any) => ({
    id: node.id,
    x: node.x,
    y: node.y
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(simulationNodes)
  }
}
