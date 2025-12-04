import "reflect-metadata";
import { DataSource } from "typeorm";
import { Destination } from "@/backend/entities/Destination";
import { PaketWisata } from "@/backend/entities/PaketWisata";
import { Room } from "@/backend/entities/Room";
import { Hotel } from "@/backend/entities/Hotel";
import { Restaurant } from "@/backend/entities/Restaurant";
import { Menu } from "@/backend/entities/Menu";
import { Artikel } from "../entities/Artikel";
import { User } from "../entities/User";
import { Umkm } from "../entities/Umkm";
import { ProdukUmkm } from "../entities/ProdukUmkm";
import { Vlog } from "../entities/Vlog";
import { Carousel } from "../entities/Carousel";
import { PilihKamiFeature } from "../entities/PilihKami";
import { SpecialPackage } from "../entities/SpecialPackage";
import { QualitySection } from "../entities/QualitySection";
import { Faq } from "../entities/Faq";
import { Newsletter } from "../entities/Newsletter";
import { AboutPage } from "../entities/AboutPage";
import { Testimonial } from "../entities/Testimonial";
import { initializeAdmin } from "@/lib/init-admin";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Zeronime09",
  database: process.env.DB_NAME || "localkarya_prod",
  synchronize: true, // jangan aktifkan di production
  logging: false,
  entities: [Destination, PaketWisata, Hotel, Room, Restaurant, Menu, Artikel, User, Umkm, ProdukUmkm, Vlog, Carousel, PilihKamiFeature, SpecialPackage, QualitySection, Faq, Newsletter, AboutPage, Testimonial]
});

// Initialize database connection hanya sekali
let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function initializeDatabase() {
  if (isInitialized) {
    return AppDataSource;
  }
  
  if (initPromise) {
    await initPromise;
    return AppDataSource;
  }
  
  initPromise = (async () => {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log("✅ Database berhasil terkoneksi");
        
        // Inisialisasi user admin default
        await initializeAdmin();
        isInitialized = true;
      }
    } catch (error) {
      console.log("❌ Database tidak terkoneksi", error);
      throw error;
    }
  })();
  
  await initPromise;
  return AppDataSource;
}