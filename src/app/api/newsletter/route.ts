import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Newsletter } from "@/backend/entities/Newsletter";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const newsletterRepository = AppDataSource.getRepository(Newsletter);
    
    // Get the first (and only) newsletter entry
    let newsletter = await newsletterRepository.findOne({
      where: { isActive: true }
    });

    // If no entry exists or not active, return default
    if (!newsletter) {
      newsletter = {
        id: 1,
        title: "Mulai Nyaba Anda",
        backgroundImageUrl: "/nyaba1.jpg",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Newsletter;
    }

    return NextResponse.json({
      success: true,
      data: newsletter
    });
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    // Return default data if there's an error
    const defaultNewsletter = {
      id: 1,
      title: "Mulai Nyaba Anda",
      backgroundImageUrl: "/nyaba1.jpg",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: defaultNewsletter
    });
  }
}