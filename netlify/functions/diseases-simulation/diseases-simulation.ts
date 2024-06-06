import { Handler } from '@netlify/functions'
import * as d3 from 'd3'

export const handler: Handler = async (event, context) => {

  const docResponse = await fetch(process.env.URL + '/data/diseases.json')
  const nodes = await docResponse.json()
  
  const simulation = d3.forceSimulation(nodes);

  return {
    statusCode: 200,
    body: JSON.stringify(nodes)
  }
}
