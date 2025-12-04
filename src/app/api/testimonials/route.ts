import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Testimonial } from "@/backend/entities/Testimonial";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const testimonialRepository = AppDataSource.getRepository(Testimonial);
    
    // Get all active testimonials ordered by orderIndex
    const testimonials = await testimonialRepository.find({
      where: {
        isActive: true
      },
      order: {
        orderIndex: "ASC"
      }
    });

    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch testimonials",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}