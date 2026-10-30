import dotenv from 'dotenv/config'
import fastify from "fastify"
import { db, initDatabase } from "./database/client.js";
import { getProductRoute } from "./routes/getProductRoute.js";
import { createProductRoute } from './routes/createProductRoute.js';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import scalarAPIReference from "@scalar/fastify-api-reference"
import { deleteProductRoute } from './routes/deleteProductRoute.js';

const { PORT } = process.env

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    }
  }
})

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.listen({ 
  port: PORT, 
  host: "0.0.0.0"
}, async (err) => {
  console.log(`Server is running`)
  try {
    await db.authenticate();
    await initDatabase();
    await 
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
  if(err) { 
    server.log.error(err);
  }
})

if(process.env.NODE_ENV === "development") { 
  server.register(fastifySwagger, { 
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'PTI - Desenvolvimento API Rest - API Docs',
        description: 'Task to subject "Desenvolvimento API REST" developed by Júlio Caria, API Documentation',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      tags: [
        { name: 'Products', description: 'Related Product Endpoints that can be use on API' },
      ],
    },
    transform: jsonSchemaTransform,
  })

  server.register(scalarAPIReference, { 
    routePrefix: "/docs",
    configuration: {
      title: 'Our API Reference',
      theme: 'deepSpace',
      spec: { 
        content: () => server.swagger(),
      }
    },
  })
}

server.register(getProductRoute);
server.register(createProductRoute);
server.register(deleteProductRoute);

export { server };