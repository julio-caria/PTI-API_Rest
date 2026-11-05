import { z } from "zod";
import { server } from "../server.js";
import { Product } from "../schemas/productSchema.js";

export function updatePartialProductRoute() { 
  server.patch("/api/v1/product/:id", { 
    schema: { 
      tags: ["Products"],
      summary: "Update Product",
      description: "Change partial attributes any product sending UUID on request params",
      body: z.object({
        name: z.string().min(1, "A name is required").optional(),
        description: z.string().optional(),
        imageUrl: z.string().nullable().optional(),
        price: z.coerce.number().positive("O preço deve ser maior que zero").optional(),
        stockUnit: z.coerce.number().int().min(0, "Estoque não pode ser negativo").optional(),
      }),
      params: z.object({ 
        id: z.uuid(),
      }),
      response: { 
        200: z.object({
          id: z.string().uuid(),
          name: z.string(),
          description: z.string(),
          imageUrl: z.string().nullable().optional(),
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
    const updateBody = request.body;

    try { 
      const product = await Product.findByPk(id);
      if(!product) { 
        return reply.status(404).send({ message: "Product not found!" });
      }
      await product.update(updateBody);
      return reply.status(200).send(product);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Internal Error" });
    }
  })
}