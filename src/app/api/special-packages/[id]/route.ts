import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { SpecialPackage } from "@/backend/entities/SpecialPackage";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const specialPackageRepository = AppDataSource.getRepository(SpecialPackage);
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const specialPackage = await specialPackageRepository.findOne({
      where: { id }
    });

    if (!specialPackage) {
      return NextResponse.json(
        { success: false, message: "Special package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: specialPackage
    });
  } catch (error) {
    console.error("Error fetching special package:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch special package",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const specialPackageRepository = AppDataSource.getRepository(SpecialPackage);
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const existingPackage = await specialPackageRepository.findOne({
      where: { id }
    });

    if (!existingPackage) {
      return NextResponse.json(
        { success: false, message: "Special package not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const orderIndex = parseInt(formData.get("orderIndex") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    
    const image = formData.get("image") as File | null;

    // Update fields
    existingPackage.title = title;
    existingPackage.description = description;
    existingPackage.orderIndex = orderIndex;
    existingPackage.isActive = isActive;

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
      
      // Delete old image if it exists
      if (existingPackage.imageUrl) {
        // Only delete if it's not one of our default images
        if (!existingPackage.imageUrl.startsWith('/images/')) {
          const oldFilePath = path.join(process.cwd(), "public", existingPackage.imageUrl.replace('/uploads/', ''));
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }
      
      existingPackage.imageUrl = `/uploads/${fileName}`;
    }

    const updatedPackage = await specialPackageRepository.save(existingPackage);

    return NextResponse.json({
      success: true,
      message: "Special package updated successfully",
      data: updatedPackage
    });
  } catch (error) {
    console.error("Error updating special package:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update special package",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const specialPackageRepository = AppDataSource.getRepository(SpecialPackage);
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const specialPackage = await specialPackageRepository.findOne({
      where: { id }
    });

    if (!specialPackage) {
      return NextResponse.json(
        { success: false, message: "Special package not found" },
        { status: 404 }
      );
    }

    // Delete image file if it exists
    if (specialPackage.imageUrl) {
      // Only delete if it's not one of our default images
      if (!specialPackage.imageUrl.startsWith('/images/')) {
        const filePath = path.join(process.cwd(), "public", specialPackage.imageUrl.replace('/uploads/', ''));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await specialPackageRepository.remove(specialPackage);

    return NextResponse.json({
      success: true,
      message: "Special package deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting special package:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete special package",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}