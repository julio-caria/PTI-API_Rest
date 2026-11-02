import { z } from "zod";
import { Product } from "../schemas/productSchema.js";
import { server } from "../server.js";

export function deleteProductRoute() { 
  server.delete("/api/v1/product/:id", { 
    schema: { 
      tags: ["Products"],
      summary: "Delete Product",
      description: "Permanently removes a product from the catalog by its ID.",
      params: z.object({
        id: z.uuid("Invalid product ID format"),
      }),
      response: { 
        200: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
        500: z.object({
          message: z.string(),
        })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    try { 
      const product = await Product.destroy({ 
        where: { id: id } 
      })
      console.log(product);
      
      if(!product) { 
        return reply.status(404).send({ message: "Product not found"})
      }

      await Product.destroy(product);

      return reply.status(200).send({ message: "Product deactivated" })
    } catch (error) { 
      return reply.status(500).send({ message: error });
    }
  })
}