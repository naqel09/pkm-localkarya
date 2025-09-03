import "reflect-metadata";
import { DataSource } from "typeorm";
import { Destination } from "@/backend/entities/Destination";
import { Room } from "@/backend/entities/Room";
import { Hotel } from "@/backend/entities/Hotel";
import { Artikel } from "../entities/Artikel";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Zeronime09",
  database: process.env.DB_NAME || "Localkarya",
  synchronize: true, // jangan aktifkan di production
  logging: false,
  entities: [Destination,Hotel,Room,Artikel]
});

try{
  await AppDataSource.initialize()
  console.log("sudah terkoneksi dengan database")
}catch(error){
  console.log("Database tidak terkoneksi")
}