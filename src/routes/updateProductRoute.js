import { z } from "zod";
import { server } from "../server.js";
import { Product } from "../schemas/productSchema.js";

export function updateProductRoute() { 
  server.put("/api/v1/product/:id", { 
    schema: { 
      tags: ["Products"],
      summary: "Update an info of product ",
      description: "Update attribute of product to change catalogue, use ID like params and send information on body (Name, Description, imageUrl, Price or StockUnit)",
      params: { 
        id: z.uuid(),
      },
      body: { 
        name: z.string(),
        description: z.string(),
        imageUrl: z.string().optional().nullable(),
        price: z.coerce.number().positive(),
        stockUnit: z.coerce.number().int(),
      },
      response: { 
        200: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          imageUrl: z.string().nullable().optional(),
          stockUnit: z.coerce.number(),
          price: z.coerce.number(),
          createdAt: z.date().or(z.string()),
          updatedAt: z.date().or(z.string()),
        }),
        400: z.object({
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
    const { name, description, imageUrl, price, stockUnit } = request.body;

    try { 
      const product = await Product.findOne(
        { isActive: true },
        {
          where: { id: id }
        }
      )

      if(!product) { 
        return reply.status(404).send({ message: "Product not found" });
      }

      await Product.update({
        name,
        description,
        imageUrl,
        price,
        stockUnit
      })

      return reply.status(200).send(product)

    } catch (error) { 
      request.log.error(error);
      return reply.status(500).send({ message: error });
    }
  })
}