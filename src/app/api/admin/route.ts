import { AppDataSource } from "@/backend/db/data-source";
import { Destination } from "@/backend/entities/Destination";
import { NextResponse } from "next/server";

export async function GET(){
  try{
    // Initialize database connection
    if(!AppDataSource.isInitialized){
      await AppDataSource.initialize();
    }
    
    // Use TypeORM repository
    const destinationRepository = AppDataSource.getRepository(Destination);
    const destinasi = await destinationRepository.find({
      order: { id: "DESC" }
    });
    
    return NextResponse.json({
      data: destinasi,
      status: 200,
      message: "success"
    });
  }catch(error){
    console.error("Error fetching destinations:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: 500
    }, { status: 500 });
  }
}

export async function POST(request: Request){
  try{
    // Initialize database connection
    if(!AppDataSource.isInitialized){
      await AppDataSource.initialize();
    }

    const body = await request.json();
    const { namaLokasi, alamat, deskripsi, gambar1, gambar2, gambar3 } = body;

    // Validate required fields
    if (!namaLokasi || !alamat || !deskripsi || !gambar1) {
      return NextResponse.json({
        message: "Missing required fields: namaLokasi, alamat, deskripsi, and gambar1 are required",
        status: 400
      }, { status: 400 });
    }

    // Use TypeORM repository
    const destinationRepository = AppDataSource.getRepository(Destination);
    
    // Create new destination
    const newDestination = destinationRepository.create({
      namaLokasi,
      alamat,
      deskripsi,
      gambar1,
      gambar2: gambar2 || null,
      gambar3: gambar3 || null
    });

    // Save to database
    const savedDestination = await destinationRepository.save(newDestination);
    
    return NextResponse.json({
      data: savedDestination,
      status: 201,
      message: "Berhasil membuat data destinasi"
    }, { status: 201 });
    
  }catch(error){
    console.error("Error creating destination:", error);
    return NextResponse.json({
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500
    }, { status: 500 });
  }
}