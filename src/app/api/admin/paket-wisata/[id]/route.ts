import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { PaketWisata } from "@/backend/entities/PaketWisata";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { id } = await params;
    const paketWisataRepository = AppDataSource.getRepository(PaketWisata);
    const paketWisata = await paketWisataRepository.findOneBy({ 
      id: parseInt(id) 
    });

    if (!paketWisata) {
      return NextResponse.json({ message: "Paket wisata not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: paketWisata,
      status: 200,
      message: "success"
    });
  } catch (error) {
    console.error("Error fetching paket wisata:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { id } = await params;
    const body = await req.json();
    const { namaPaket, alamat, deskripsi, harga, yangTermasuk, jadwal, noWa, gambar1, gambar2, gambar3, gambar4, gambar360 } = body;
    const paketWisataId = parseInt(id);

    // Validate required fields
    if (!namaPaket || !alamat || !deskripsi || !harga || !gambar1) {
      return NextResponse.json({
        message: "Missing required fields: namaPaket, alamat, deskripsi, harga, and gambar1 are required",
        status: 400
      }, { status: 400 });
    }

    const paketWisataRepository = AppDataSource.getRepository(PaketWisata);
    
    // Find existing paket wisata
    const existingPaketWisata = await paketWisataRepository.findOneBy({ id: paketWisataId });
    
    if (!existingPaketWisata) {
      return NextResponse.json({ 
        message: "Paket wisata not found",
        status: 404
      }, { status: 404 });
    }

    // Update paket wisata
    await paketWisataRepository.update(paketWisataId, {
      namaPaket,
      alamat,
      deskripsi,
      harga: parseFloat(harga),
      yangTermasuk: Array.isArray(yangTermasuk) ? yangTermasuk.filter(item => item && item.trim()) : [],
      jadwal: Array.isArray(jadwal) ? jadwal.filter(item => item.waktu && item.kegiatan) : [],
      noWa: noWa?.trim() || null,
      gambar1,
      gambar2: gambar2 || null,
      gambar3: gambar3 || null,
      gambar4: gambar4 || null,
      gambar360: gambar360 || null,
    });

    // Fetch updated paket wisata
    const updatedPaketWisata = await paketWisataRepository.findOneBy({ id: paketWisataId });

    return NextResponse.json({
      data: updatedPaketWisata,
      status: 200,
      message: "Paket wisata updated successfully"
    });
  } catch (error) {
    console.error("Error updating paket wisata:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { id } = await params;
    const paketWisataId = parseInt(id);
    
    const paketWisataRepository = AppDataSource.getRepository(PaketWisata);
    
    // Check if paket wisata exists
    const existingPaketWisata = await paketWisataRepository.findOneBy({ id: paketWisataId });
    
    if (!existingPaketWisata) {
      return NextResponse.json({ 
        message: "Paket wisata not found",
        status: 404
      }, { status: 404 });
    }

    // Delete paket wisata
    await paketWisataRepository.delete(paketWisataId);

    return NextResponse.json({
      message: "Paket wisata deleted successfully",
      status: 200
    });
  } catch (error) {
    console.error("Error deleting paket wisata:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}