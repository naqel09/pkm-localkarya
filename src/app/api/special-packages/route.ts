import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { SpecialPackage } from "@/backend/entities/SpecialPackage";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const specialPackageRepository = AppDataSource.getRepository(SpecialPackage);
    
    // Get all active special packages ordered by orderIndex
    let packages = await specialPackageRepository.find({
      where: { isActive: true },
      order: { orderIndex: "ASC" }
    });

    // If no packages exist, create default ones
    if (packages.length === 0) {
      const defaultPackages = [
        {
          title: "Pengalaman Wisata Alam",
          description: "Nikmati keindahan alam pegunungan Bandung Barat yang masih asli dan mempesona dengan pemandu lokal yang berpengalaman.",
          imageUrl: "/images/mountain2.jpg",
          orderIndex: 0,
          isActive: true
        },
        {
          title: "Wisata Keluarga",
          description: "Kegembiraan dan tawa untuk seluruh anggota keluarga di setiap petualangan wisata alam yang kami sediakan.",
          imageUrl: "/images/cultural.jpg",
          orderIndex: 1,
          isActive: true
        }
      ];

      // Create default packages
      for (const item of defaultPackages) {
        const pkg = specialPackageRepository.create(item);
        await specialPackageRepository.save(pkg);
      }

      // Fetch the newly created items
      packages = await specialPackageRepository.find({
        where: { isActive: true },
        order: { orderIndex: "ASC" }
      });
    }

    return NextResponse.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error("Error fetching special packages:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch special packages",
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

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const orderIndex = parseInt(formData.get("orderIndex") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    
    const image = formData.get("image") as File | null;

    const specialPackageRepository = AppDataSource.getRepository(SpecialPackage);
    
    // Handle image upload if provided
    let imageUrl = null;
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
      
      imageUrl = `/uploads/${fileName}`;
    }

    const specialPackage = specialPackageRepository.create({
      title,
      description,
      imageUrl,
      orderIndex,
      isActive
    });

    const savedPackage = await specialPackageRepository.save(specialPackage);

    return NextResponse.json({
      success: true,
      message: "Special package created successfully",
      data: savedPackage
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating special package:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create special package",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}