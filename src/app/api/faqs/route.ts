import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Faq } from "@/backend/entities/Faq";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const faqRepository = AppDataSource.getRepository(Faq);
    
    // Get all active FAQs ordered by orderIndex
    const faqs = await faqRepository.find({
      where: { isActive: true },
      order: { orderIndex: "ASC" }
    });

    return NextResponse.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch FAQs",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}