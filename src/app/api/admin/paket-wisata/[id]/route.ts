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
    const paketWisataId = parseInt(id);

    // Handle multipart form data for file uploads
    const formData = await req.formData();
    
    // Extract text fields
    const namaPaket = formData.get('namaPaket') as string;
    const alamat = formData.get('alamat') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const harga = formData.get('harga') as string;
    const noWa = formData.get('noWa') as string;
    
    // Extract array fields (JSON strings)
    let yangTermasuk: string[] = [];
    let jadwal: { waktu: string; kegiatan: string }[] = [];
    
    try {
      const yangTermasukStr = formData.get('yangTermasuk') as string;
      if (yangTermasukStr) {
        yangTermasuk = JSON.parse(yangTermasukStr);
      }
    } catch (e) {
      console.warn("Failed to parse yangTermasuk:", e);
    }
    
    try {
      const jadwalStr = formData.get('jadwal') as string;
      if (jadwalStr) {
        jadwal = JSON.parse(jadwalStr);
      }
    } catch (e) {
      console.warn("Failed to parse jadwal:", e);
    }

    // Handle image uploads
    const uploadImage = async (file: File | null): Promise<string | null> => {
      if (!file) return null;
      
      try {
        // Create FormData for upload API
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        // Call the upload API
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`, {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          if (uploadResult.success) {
            return uploadResult.filename;
          }
        }
        return null;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }
    };

    // Upload images
    const gambar1File = formData.get('gambar1') as File;
    const gambar2File = formData.get('gambar2') as File;
    const gambar3File = formData.get('gambar3') as File;
    const gambar4File = formData.get('gambar4') as File;
    const gambar360File = formData.get('gambar360') as File;
    
    const gambar1 = await uploadImage(gambar1File);
    const gambar2 = await uploadImage(gambar2File);
    const gambar3 = await uploadImage(gambar3File);
    const gambar4 = await uploadImage(gambar4File);
    const gambar360 = await uploadImage(gambar360File);

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
    const updateData: Partial<PaketWisata> = {
      namaPaket,
      alamat,
      deskripsi,
      harga: parseFloat(harga),
      yangTermasuk: Array.isArray(yangTermasuk) ? yangTermasuk.filter(item => item && item.trim()) : [],
      jadwal: Array.isArray(jadwal) ? jadwal.filter(item => item.waktu && item.kegiatan) : [],
      noWa: noWa?.trim() || undefined,
    };

    // Only update images if new ones were uploaded
    if (gambar1) updateData.gambar1 = gambar1;
    if (gambar2) updateData.gambar2 = gambar2 || undefined;
    if (gambar3) updateData.gambar3 = gambar3 || undefined;
    if (gambar4) updateData.gambar4 = gambar4 || undefined;
    if (gambar360) updateData.gambar360 = gambar360 || undefined;

    await paketWisataRepository.update(paketWisataId, updateData);

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