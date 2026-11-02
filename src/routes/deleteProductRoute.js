import { z } from "zod";
import { Product } from "../schemas/productSchema.js";
import { server } from "../server.js";

export function deleteProductRoute() { 
  server.delete("/api/v1/product/:id", { 
    schema: { 
      tags: ["Products"],
      summary: "Deactivate Product",
      description: "Deactivates a product in the catalog by its ID.",
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
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    try { 
      const [updatedProducts] = await Product.update(
        { isActive: false },
        { 
          where: { 
            id,
            isActive: true,
          } 
        }
      )
      if(!updatedProducts) { 
        return reply.status(404).send({ message: "Product not found"})
      }
  
      return reply.status(200).send({ message: "Product deactivated" })
    } catch (error) { 
      request.log.error(error);
      return reply.status(500).send({ message: "Internal server error" });
    }
  })
}