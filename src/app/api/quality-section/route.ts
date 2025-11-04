import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { QualitySection } from "@/backend/entities/QualitySection";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const qualitySectionRepository = AppDataSource.getRepository(QualitySection);
    
    // Get the first (and only) quality section entry
    let qualitySection = await qualitySectionRepository.findOne({
      where: {}
    });

    // If no entry exists, create a default one
    if (!qualitySection) {
      const defaultQualitySection = qualitySectionRepository.create({
        title: "Kualitas Terbaik untuk Pengalaman Nyaba Anda",
        description: "Kami berkomitmen memberikan pelayanan wisata terbaik di Desa Karyawangi untuk menciptakan kenangan indah yang tak terlupakan.",
        backgroundImageUrl: "/nyaba7.jpg",
        tag1Quantity: "5+",
        tag1Description: "tahun pengalaman wisata desa",
        tag2Quantity: "15+",
        tag2Description: "destinasi menarik di desa",
        tag3Quantity: "50+",
        tag3Description: "paket wisata tersedia",
        tag4Quantity: "1,000+",
        tag4Description: "pengunjung puas"
      });

      qualitySection = await qualitySectionRepository.save(defaultQualitySection);
    }

    return NextResponse.json({
      success: true,
      data: qualitySection
    });
  } catch (error) {
    console.error("Error fetching quality section:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch quality section",
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

    const qualitySectionRepository = AppDataSource.getRepository(QualitySection);
    
    // Get the first (and only) quality section entry
    let qualitySection = await qualitySectionRepository.findOne({
      where: {}
    });

    // If no entry exists, create one
    if (!qualitySection) {
      qualitySection = qualitySectionRepository.create({});
    }

    const formData = await request.formData();
    
    // Text fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    
    // Tag fields
    const tag1Quantity = formData.get("tag1Quantity") as string;
    const tag1Description = formData.get("tag1Description") as string;
    const tag2Quantity = formData.get("tag2Quantity") as string;
    const tag2Description = formData.get("tag2Description") as string;
    const tag3Quantity = formData.get("tag3Quantity") as string;
    const tag3Description = formData.get("tag3Description") as string;
    const tag4Quantity = formData.get("tag4Quantity") as string;
    const tag4Description = formData.get("tag4Description") as string;
    
    // Image
    const image = formData.get("image") as File | null;

    // Update fields
    qualitySection.title = title || qualitySection.title;
    qualitySection.description = description || qualitySection.description;
    qualitySection.tag1Quantity = tag1Quantity || qualitySection.tag1Quantity;
    qualitySection.tag1Description = tag1Description || qualitySection.tag1Description;
    qualitySection.tag2Quantity = tag2Quantity || qualitySection.tag2Quantity;
    qualitySection.tag2Description = tag2Description || qualitySection.tag2Description;
    qualitySection.tag3Quantity = tag3Quantity || qualitySection.tag3Quantity;
    qualitySection.tag3Description = tag3Description || qualitySection.tag3Description;
    qualitySection.tag4Quantity = tag4Quantity || qualitySection.tag4Quantity;
    qualitySection.tag4Description = tag4Description || qualitySection.tag4Description;

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
      if (qualitySection.backgroundImageUrl) {
        // Only delete if it's an uploaded file (starts with /uploads/)
        if (qualitySection.backgroundImageUrl.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), "public", qualitySection.backgroundImageUrl.replace('/uploads/', ''));
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }
      
      qualitySection.backgroundImageUrl = `/uploads/${fileName}`;
    }

    const updatedQualitySection = await qualitySectionRepository.save(qualitySection);

    return NextResponse.json({
      success: true,
      message: "Quality section updated successfully",
      data: updatedQualitySection
    });
  } catch (error) {
    console.error("Error updating quality section:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update quality section",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}