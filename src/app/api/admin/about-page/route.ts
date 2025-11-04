import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { AboutPage } from "@/backend/entities/AboutPage";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const aboutPageRepository = AppDataSource.getRepository(AboutPage);
    
    // Get the first (and only) about page entry
    let aboutPage = await aboutPageRepository.findOne({
      where: {}
    });

    // If no entry exists, create a default one
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

export async function PUT(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const aboutPageRepository = AppDataSource.getRepository(AboutPage);
    
    // Get the first (and only) about page entry
    let aboutPage = await aboutPageRepository.findOne({
      where: {}
    });

    // If no entry exists, create one
    if (!aboutPage) {
      aboutPage = aboutPageRepository.create({});
    }

    const formData = await request.formData();
    
    // Text fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const googleMapsUrl = formData.get("googleMapsUrl") as string;
    const instagramUrl = formData.get("instagramUrl") as string | null;
    const facebookUrl = formData.get("facebookUrl") as string | null;
    const tiktokUrl = formData.get("tiktokUrl") as string | null;
    
    // Image
    const image = formData.get("image") as File | null;

    // Update fields
    aboutPage.title = title || aboutPage.title;
    aboutPage.description = description || aboutPage.description;
    aboutPage.address = address || aboutPage.address;
    aboutPage.phone = phone || aboutPage.phone;
    aboutPage.email = email || aboutPage.email;
    aboutPage.whatsappNumber = whatsappNumber || aboutPage.whatsappNumber;
    aboutPage.googleMapsUrl = googleMapsUrl || aboutPage.googleMapsUrl;
    // Update social media fields (set to null if empty string is passed)
    aboutPage.instagramUrl = instagramUrl || null;
    aboutPage.facebookUrl = facebookUrl || null;
    aboutPage.tiktokUrl = tiktokUrl || null;

    // Handle image upload if provided
    if (image && image.size > 0) {
      // In a real implementation, you would upload the image to a storage service
      // For now, we'll save it locally and store the path
      const fileName = `${Date.now()}-${image.name}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save image to public/uploads directory
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Create upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      
      // Delete old image if it exists and it's an uploaded file (not a static asset)
      if (aboutPage.backgroundImageUrl) {
        // Only delete if it's an uploaded file (starts with /uploads/)
        if (aboutPage.backgroundImageUrl.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), "public", aboutPage.backgroundImageUrl.replace('/uploads/', ''));
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }
      
      aboutPage.backgroundImageUrl = `/uploads/${fileName}`;
    }

    const updatedAboutPage = await aboutPageRepository.save(aboutPage);

    return NextResponse.json({
      success: true,
      message: "About page updated successfully",
      data: updatedAboutPage
    });
  } catch (error) {
    console.error("Error updating about page:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update about page",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}