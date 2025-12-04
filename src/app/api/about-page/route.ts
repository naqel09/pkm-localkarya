import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { AboutPage } from "@/backend/entities/AboutPage";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const aboutPageRepository = AppDataSource.getRepository(AboutPage);
    
    // Get the first (and only) about page entry
    let aboutPage = await aboutPageRepository.findOne({
      where: {
        isActive: true
      }
    });

    // If no active entry exists, create a default one
    if (!aboutPage) {
      const defaultAboutPage = aboutPageRepository.create({
        title: "Tentang Kami",
        description: "Desa Karyawangi terletak di kaki pegunungan Parongpong, Bandung Barat, yang menawarkan keindahan alam menawan dan kearifan budaya Sunda yang masih terjaga. \"Nyaba\" dalam bahasa Sunda berarti bermain atau berekreasi, yang menjadi filosofi utama kami dalam menghadirkan pengalaman wisata yang menyenangkan dan berkesan.\n\nKami percaya bahwa setiap perjalanan harus memberikan kegembiraan, pembelajaran, dan koneksi yang mendalam dengan alam dan budaya lokal. Tim kami yang terdiri dari warga desa berpengalaman siap memandu Anda menjelajahi setiap sudut keindahan Karyawangi dengan hati yang tulus.",
        address: "Desa Karyawangi, Kecamatan Parongpong\nKabupaten Bandung Barat, Jawa Barat",
        phone: "+62 812-3456-7890",
        email: "info.timnyaba@gmail.com",
        whatsappNumber: "6281234567890",
        googleMapsUrl: "https://maps.app.goo.gl/9XopyAHGHQvParsC6",
        instagramUrl: null,
        facebookUrl: null,
        tiktokUrl: null,
        backgroundImageUrl: "/bgImage.jpg",
        logoUrl: null,
        isActive: true
      });

      aboutPage = await aboutPageRepository.save(defaultAboutPage);
    }

    return NextResponse.json({
      success: true,
      data: aboutPage
    });
  } catch (error) {
    console.error("Error fetching about page:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch about page",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}