import { z } from "zod";
import { server } from "../server.js";
import { Product } from "../schemas/productSchema.js";

export function createProductRoute() { 
  server.post("/api/v1/product", { 
    schema: {
      tags: ["Products"],
      summary: "Create Product",
      description: "Use this endpoint to register a new product on database, send required information, return product's UUID ",
      body: z.object({ 
        name: z.string().min(1),
        description: z.string(),
        imageUrl: z.string().url().min(1),
        stockUnit: z.coerce.number().default(0),
        price: z.coerce.number().positive(),
      }),
      response: { 
        201: z.object({ 
          productId: z.string(), 
        }),
        400: z.object({
          message: z.string(),
        })
      }
    }
  }, async (request, reply) => { 
    const { name, description, imageUrl, stockUnit, price } = request.body;
    try {
      const result = await Product.create({
        name,
        description,
        imageUrl,
        stockUnit,
        price
      });

      return reply.status(201).send({ productId: result.id })
    } catch (error) { 
      request.log.error(error, "Unable to create product");
      return reply.status(400).send({ message: "Cant be complete this request" })
    }
  })
}