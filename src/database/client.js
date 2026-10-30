import "dotenv/config";
import { PostgresDialect } from "@sequelize/postgres";
import { Sequelize } from "@sequelize/core";

const { 
  HOST, 
  DATABASE_NAME, 
  DATABASE_USER, 
  DATABASE_PASSWORD 
} = process.env;

export const db = new Sequelize({
  dialect: PostgresDialect, 
  database: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  host: HOST,
  port: 5432,
  ssl: false,
  clientMinMessages: 'notice',
});

export async function initDatabase() {
  try { 
    await db.sync({ alter: true });
    console.log('Tables has been sync successfully.');
  } catch (error) {
    console.error("Cannot sync tables, try again, error: ", error)
  }
}