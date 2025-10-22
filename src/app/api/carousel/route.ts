import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Carousel } from "@/backend/entities/Carousel";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const carouselRepository = AppDataSource.getRepository(Carousel);
    
    // Get all active carousel items ordered by orderIndex
    let carousels = await carouselRepository.find({
      where: { isActive: true },
      order: { orderIndex: "ASC" }
    });

    // If no carousel items exist, create default ones
    if (carousels.length === 0) {
      const defaultItems = [
        {
          title: "Selamat Datang di Desa Karyawangi",
          subtitle: "NYABA WISATA",
          description: "Rasakan keseruan bermain dan menjelajahi keindahan alam Desa Karyawangi, Parongpong, Bandung Barat. Tempat di mana tradisi bertemu dengan petualangan modern, dan setiap sudut menawarkan pengalaman tak terlupakan untuk keluarga.",
          imageUrl: "/nyaba1.jpg",
          orderIndex: 0,
          isActive: true
        },
        {
          title: "Keindahan Alam yang Menakjubkan",
          subtitle: "PETUALANGAN SERU",
          description: "Nikmati keindahan alam yang masih alami dan asri di Desa Karyawangi. Berbagai aktivitas outdoor menantang yang siap memacu adrenalin Anda dan keluarga.",
          imageUrl: "/nyaba2.jpg",
          orderIndex: 1,
          isActive: true
        }
      ];

      // Create default carousel items
      for (const item of defaultItems) {
        const carousel = carouselRepository.create(item);
        await carouselRepository.save(carousel);
      }

      // Fetch the newly created items
      carousels = await carouselRepository.find({
        where: { isActive: true },
        order: { orderIndex: "ASC" }
      });
    }

    return NextResponse.json({
      success: true,
      data: carousels
    });
  } catch (error) {
    console.error("Error fetching carousels:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengambil data carousel",
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
    const { title, subtitle, description, imageUrl, orderIndex, isActive } = body;

    const carouselRepository = AppDataSource.getRepository(Carousel);
    
    const carousel = carouselRepository.create({
      title,
      subtitle: subtitle || null,
      description,
      imageUrl,
      orderIndex: orderIndex || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedCarousel = await carouselRepository.save(carousel);

    return NextResponse.json({
      success: true,
      message: "Carousel berhasil dibuat",
      data: savedCarousel
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating carousel:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal membuat carousel",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}