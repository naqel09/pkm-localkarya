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

export async function POST(request: Request){
  try{
    // Initialize database connection
    if(!AppDataSource.isInitialized){
      await AppDataSource.initialize();
    }

    const body = await request.json();
    const { namaPaket, alamat, deskripsi, harga, gambar1, gambar2, gambar3, gambar4, gambar360 } = body;

    // Validate required fields
    if (!namaPaket || !alamat || !deskripsi || !harga || !gambar1) {
      return NextResponse.json({
        message: "Missing required fields: namaPaket, alamat, deskripsi, harga, and gambar1 are required",
        status: 400
      }, { status: 400 });
    }

    // Use TypeORM repository
    const paketWisataRepository = AppDataSource.getRepository(PaketWisata);
    
    // Create new paket wisata
    const newPaketWisata = paketWisataRepository.create({
      namaPaket,
      alamat,
      deskripsi,
      harga: parseFloat(harga),
      gambar1,
      gambar2: gambar2 || null,
      gambar3: gambar3 || null,
      gambar4: gambar4 || null,
      gambar360: gambar360 || null,
    });

    // Save to database
    const savedPaketWisata = await paketWisataRepository.save(newPaketWisata);

    return NextResponse.json({
      data: savedPaketWisata,
      status: 201,
      message: "Paket wisata created successfully"
    });
  }catch(error){
    console.error("Error creating paket wisata:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: 500
    }, { status: 500 });
  }
}