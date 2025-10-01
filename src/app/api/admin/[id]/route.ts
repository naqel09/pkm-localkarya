import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Destination } from "@/backend/entities/Destination";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { id } = await params;
    const destinationRepository = AppDataSource.getRepository(Destination);
    const destination = await destinationRepository.findOneBy({ 
      id: parseInt(id) 
    });

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: destination,
      status: 200,
      message: "success"
    });
  } catch (error) {
    console.error("Error fetching destination:", error);
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
    const { namaLokasi, alamat, deskripsi, gambar1, gambar2, gambar3, jamOperasional, tiketMasuk, kontakPerson, linkGmaps } = body;
    const destinationId = parseInt(id);

    // Validate required fields
    if (!namaLokasi || !alamat || !deskripsi || !gambar1) {
      return NextResponse.json({
        message: "Missing required fields: namaLokasi, alamat, deskripsi, and gambar1 are required",
        status: 400
      }, { status: 400 });
    }

    // Validate WhatsApp number format if provided
    if (kontakPerson && kontakPerson.trim() !== '') {
      const waRegex = /^62\d{9,13}$/;
      if (!waRegex.test(kontakPerson.trim())) {
        return NextResponse.json({
          message: 'Nomor WhatsApp harus dimulai dengan 62 dan memiliki 11-15 digit',
          status: 400
        }, { status: 400 });
      }
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
      gambar3: gambar3 || null,
      jamOperasional: jamOperasional || destination.jamOperasional || "24 Jam",
      tiketMasuk: tiketMasuk || null,
      kontakPerson: kontakPerson ? kontakPerson.trim() : null,
      linkGmaps: linkGmaps || destination.linkGmaps || ""
    });

    // Save updated destination
    const updatedDestination = await destinationRepository.save(destination);

    return NextResponse.json(updatedDestination, { status: 200 });
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { id } = await params;
    const destinationId = parseInt(id);
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
