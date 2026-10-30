import { z } from "zod";
import { Product } from "../schemas/productSchema.js";
import { server } from "../server.js";

export function getProductRoute() { 
  server.get("/api/v1/product", { 
    schema: { 
      tags: ["Products"],
      summary: "Get Products",
      description: "Retrieves all products available in the catalog.",
      response: { 
        200: z.object({
          products: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              imageUrl: z.string(),
              stockUnit: z.coerce.number(),
              price: z.coerce.number(),
              createdAt: z.date(),
              updatedAt: z.date(),
            })
          )
        }),
        404: z.object({ 
          message: z.string(),
        }),
        500: z.object({ 
          message: z.string(),
        })
      },
    }
  }, async (request, reply) => {
    try { 
      const result = await Product.findAll();
  
      if(result.length === 0) { 
        return reply.status(404).send({ message: "No products found" })
      }

      return reply.status(200).send({ products: result })
    } catch (error) { 
      request.log.error(error);
      return reply.status(500).send({ message: error })
    }
  })
}