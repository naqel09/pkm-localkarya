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

    // Handle multipart form data for file uploads
    const formData = await request.formData();
    
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

    // Use TypeORM repository
    const paketWisataRepository = AppDataSource.getRepository(PaketWisata);
    
    // Create new paket wisata
    const newPaketWisata = new PaketWisata();
    newPaketWisata.namaPaket = namaPaket;
    newPaketWisata.alamat = alamat;
    newPaketWisata.deskripsi = deskripsi;
    newPaketWisata.harga = parseFloat(harga);
    newPaketWisata.yangTermasuk = Array.isArray(yangTermasuk) ? yangTermasuk.filter(item => item && item.trim()) : [];
    newPaketWisata.jadwal = Array.isArray(jadwal) ? jadwal.filter(item => item.waktu && item.kegiatan) : [];
    newPaketWisata.noWa = noWa?.trim() || undefined;
    newPaketWisata.gambar1 = gambar1!;
    newPaketWisata.gambar2 = gambar2 || undefined;
    newPaketWisata.gambar3 = gambar3 || undefined;
    newPaketWisata.gambar4 = gambar4 || undefined;
    newPaketWisata.gambar360 = gambar360 || undefined;

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