import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Newsletter } from "@/backend/entities/Newsletter";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const newsletterRepository = AppDataSource.getRepository(Newsletter);
    
    // Get the first (and only) newsletter entry
    let newsletter = await newsletterRepository.findOne({
      where: {}
    });

    // If no entry exists, create a default one
    if (!newsletter) {
      const defaultNewsletter = newsletterRepository.create({
        title: "Mulai Nyaba Anda",
        backgroundImageUrl: "/nyaba1.jpg",
        isActive: true
      });

      newsletter = await newsletterRepository.save(defaultNewsletter);
    }

    return NextResponse.json({
      success: true,
      data: newsletter
    });
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch newsletter",
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

    const newsletterRepository = AppDataSource.getRepository(Newsletter);
    
    // Get the first (and only) newsletter entry
    let newsletter = await newsletterRepository.findOne({
      where: {}
    });

    // If no entry exists, create one
    if (!newsletter) {
      newsletter = newsletterRepository.create({});
    }

    const formData = await request.formData();
    
    // Text fields
    const title = formData.get("title") as string;
    
    // Image
    const image = formData.get("image") as File | null;

    // Update fields
    newsletter.title = title || newsletter.title;

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
      if (newsletter.backgroundImageUrl) {
        // Only delete if it's an uploaded file (starts with /uploads/)
        if (newsletter.backgroundImageUrl.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), "public", newsletter.backgroundImageUrl.replace('/uploads/', ''));
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }
      
      newsletter.backgroundImageUrl = `/uploads/${fileName}`;
    }

    const updatedNewsletter = await newsletterRepository.save(newsletter);

    return NextResponse.json({
      success: true,
      message: "Newsletter updated successfully",
      data: updatedNewsletter
    });
  } catch (error) {
    console.error("Error updating newsletter:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update newsletter",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}