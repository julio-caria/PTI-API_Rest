import { z } from "zod";
import { Product } from "../schemas/productSchema.js";
import { server } from "../server.js";

export function getProductRouteById() {
  server.get("/api/v1/product/:id", {
    schema: {
      tags: ["Products"],
      summary: "Get product by Id",
      description: "Search a product with ID, ID is an UUID that be found on 'get products route' too.",
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          id: z.string().uuid(),
          name: z.string(),
          description: z.string(),
          imageUrl: z.string(),
          price: z.coerce.number(),
          stockUnit: z.coerce.number(),
          createdAt: z.date().or(z.string()),
          updatedAt: z.date().or(z.string()),
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
      const result = await Product.findOne({
        where: {
          id,
          isActive: true,
        },
      });

      if(!result) { 
        return reply.status(404).send({ message: "Product Not Found, verify ID and try again." })
      }

      return reply.status(200).send(result)

    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Internal server error" });
    }
  })
}