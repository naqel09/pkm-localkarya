import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { PilihKamiFeature } from "@/backend/entities/PilihKami";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const pilihKamiRepository = AppDataSource.getRepository(PilihKamiFeature);
    
    // Get all active features ordered by orderIndex
    let features = await pilihKamiRepository.find({
      where: { isActive: true },
      order: { orderIndex: "ASC" }
    });

    // If no features exist, create default ones
    if (features.length === 0) {
      const defaultItems = [
        {
          title: "Kegembiraan Keluarga",
          description: "Kami menghadirkan kebahagiaan dan tawa untuk seluruh anggota keluarga di setiap petualangan.",
          orderIndex: 0,
          isActive: true
        },
        {
          title: "Wisata Alam Autentik",
          description: "Nikmati keindahan alam pegunungan Bandung Barat yang masih asli dan mempesona.",
          orderIndex: 1,
          isActive: true
        },
        {
          title: "Pemandu Lokal Berpengalaman",
          description: "Dipandu oleh warga lokal yang mengenal setiap sudut desa dan budaya Sunda.",
          orderIndex: 2,
          isActive: true
        },
        {
          title: "Fleksibilitas Waktu",
          description: "Jadwal wisata yang dapat disesuaikan dengan kebutuhan dan kenyamanan Anda.",
          orderIndex: 3,
          isActive: true
        }
      ];

      // Create default features
      for (const item of defaultItems) {
        const feature = pilihKamiRepository.create(item);
        await pilihKamiRepository.save(feature);
      }

      // Fetch the newly created items
      features = await pilihKamiRepository.find({
        where: { isActive: true },
        order: { orderIndex: "ASC" }
      });
    }

    return NextResponse.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error("Error fetching pilih kami features:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengambil data fitur pilih kami",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await request.json();
    const { title, description, orderIndex, isActive } = body;

    const pilihKamiRepository = AppDataSource.getRepository(PilihKamiFeature);
    
    const feature = pilihKamiRepository.create({
      title,
      description,
      orderIndex: orderIndex || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedFeature = await pilihKamiRepository.save(feature);

    return NextResponse.json({
      success: true,
      message: "Fitur berhasil dibuat",
      data: savedFeature
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating pilih kami feature:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal membuat fitur pilih kami",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}