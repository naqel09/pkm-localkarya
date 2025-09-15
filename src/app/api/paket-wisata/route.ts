import { AppDataSource } from "@/backend/db/data-source";
import { PaketWisata } from "@/backend/entities/PaketWisata";
import { NextResponse } from "next/server";

export async function GET(){
  try{
    // Initialize database connection
    if(!AppDataSource.isInitialized){
      await AppDataSource.initialize();
    }
    
    // Use TypeORM repository
    const paketWisataRepository = AppDataSource.getRepository(PaketWisata);
    const paketWisata = await paketWisataRepository.find({
      order: { id: "DESC" }
    });
    
    return NextResponse.json({
      data: paketWisata,
      status: 200,
      message: "success"
    });
  }catch(error){
    console.error("Error fetching paket wisata:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: 500
    }, { status: 500 });
  }
}