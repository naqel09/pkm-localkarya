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

    // If no active entry exists, return null
    if (!aboutPage) {
      return NextResponse.json({
        success: true,
        data: null
      });
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