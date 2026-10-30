import { DataTypes } from "@sequelize/core";
import { db } from "../database/client.js";

export const Product = db.define(
  'Product', {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stockUnit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    price: { 
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    createdAt: { 
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: { 
      type: DataTypes.DATE,
    }
  },
)