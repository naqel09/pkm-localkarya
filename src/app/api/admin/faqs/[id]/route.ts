import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Faq } from "@/backend/entities/Faq";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid FAQ ID" },
        { status: 400 }
      );
    }

    const faqRepository = AppDataSource.getRepository(Faq);
    
    // Find the FAQ by ID
    const faq = await faqRepository.findOne({
      where: { id }
    });

    if (!faq) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch FAQ",
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid FAQ ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { question, answer, orderIndex, isActive } = body;

    const faqRepository = AppDataSource.getRepository(Faq);
    
    // Find the FAQ by ID
    const faq = await faqRepository.findOne({
      where: { id }
    });

    if (!faq) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 }
      );
    }

    // Update fields
    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    faq.orderIndex = orderIndex !== undefined ? orderIndex : faq.orderIndex;
    faq.isActive = isActive !== undefined ? isActive : faq.isActive;

    const updatedFaq = await faqRepository.save(faq);

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully",
      data: updatedFaq
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update FAQ",
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid FAQ ID" },
        { status: 400 }
      );
    }

    const faqRepository = AppDataSource.getRepository(Faq);
    
    // Find the FAQ by ID
    const faq = await faqRepository.findOne({
      where: { id }
    });

    if (!faq) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 }
      );
    }

    // Delete the FAQ
    await faqRepository.remove(faq);

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete FAQ",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}