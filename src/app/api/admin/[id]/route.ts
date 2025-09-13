import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Destination } from "@/backend/entities/Destination";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const destinationRepository = AppDataSource.getRepository(Destination);
    const destination = await destinationRepository.findOneBy({ 
      id: parseInt(params.id) 
    });

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 });
    }

    return NextResponse.json(destination, { status: 200 });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await req.json();
    const { namaLokasi, alamat, deskripsi, gambar1, gambar2, gambar3 } = body;
    const destinationId = parseInt(params.id);

    // Validate required fields
    if (!namaLokasi || !alamat || !deskripsi || !gambar1) {
      return NextResponse.json({
        message: "Missing required fields: namaLokasi, alamat, deskripsi, and gambar1 are required",
        status: 400
      }, { status: 400 });
    }

    const destinationRepository = AppDataSource.getRepository(Destination);
    
    // Find destination by ID
    const destination = await destinationRepository.findOneBy({ id: destinationId });

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 });
    }

    // Update destination properties
    destinationRepository.merge(destination, {
      namaLokasi,
      alamat,
      deskripsi,
      gambar1,
      gambar2: gambar2 || null,
      gambar3: gambar3 || null
    });

    // Save updated destination
    const updatedDestination = await destinationRepository.save(destination);

    return NextResponse.json(updatedDestination, { status: 200 });
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const destinationId = parseInt(params.id);
    const destinationRepository = AppDataSource.getRepository(Destination);

    // Find destination by ID
    const destination = await destinationRepository.findOneBy({ id: destinationId });

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 });
    }

    // Delete destination
    await destinationRepository.remove(destination);

    return NextResponse.json({ message: "Destination deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
