import fastify from "fastify"
import dotenv from 'dotenv/config'

export const server = fastify();
const port = process.env.PORT

server.listen({ 
  port, 
  host: "0.0.0.0"
})
  .then(() => { 
    console.log(`Server is running on http://localhost:${port}`)
})