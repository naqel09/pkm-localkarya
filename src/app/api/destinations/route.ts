import { AppDataSource } from "@/backend/db/data-source";
import { Destination } from "@/backend/entities/Destination";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Use TypeORM repository
    const destinationRepository = AppDataSource.getRepository(Destination);
    const destinations = await destinationRepository.find({
      order: { createdAt: "DESC" }
    });
    
    return NextResponse.json({
      data: destinations,
      status: 200,
      message: "success"
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: 500
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const destinationData = await request.json();
    
    // Validate required fields
    if (!destinationData.namaLokasi || !destinationData.alamat || !destinationData.deskripsi) {
      return NextResponse.json(
        { message: "Nama lokasi, alamat, dan deskripsi harus diisi" },
        { status: 400 }
      );
    }
    
    // Use TypeORM repository
    const destinationRepository = AppDataSource.getRepository(Destination);
    
    // Create new destination
    const newDestination = destinationRepository.create({
      namaLokasi: destinationData.namaLokasi,
      alamat: destinationData.alamat,
      deskripsi: destinationData.deskripsi,
      gambar1: destinationData.gambar1 || '',
      gambar2: destinationData.gambar2 || '',
      gambar3: destinationData.gambar3 || ''
    });
    
    const savedDestination = await destinationRepository.save(newDestination);
    
    return NextResponse.json({
      message: "Destinasi berhasil dibuat",
      data: savedDestination,
      status: 201
    });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}