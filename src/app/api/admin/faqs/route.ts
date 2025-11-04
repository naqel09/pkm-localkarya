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

export async function POST(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await request.json();
    const { question, answer, orderIndex, isActive } = body;

    const faqRepository = AppDataSource.getRepository(Faq);
    
    const faq = faqRepository.create({
      question,
      answer,
      orderIndex: orderIndex || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedFaq = await faqRepository.save(faq);

    return NextResponse.json({
      success: true,
      message: "FAQ created successfully",
      data: savedFaq
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create FAQ",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}