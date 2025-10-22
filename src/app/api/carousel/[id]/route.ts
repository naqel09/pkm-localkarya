import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Carousel } from "@/backend/entities/Carousel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID carousel tidak valid" },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const carouselRepository = AppDataSource.getRepository(Carousel);
    const carousel = await carouselRepository.findOne({
      where: { id }
    });

    if (!carousel) {
      return NextResponse.json(
        { success: false, message: "Carousel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: carousel
    });
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengambil data carousel",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID carousel tidak valid" },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await request.json();
    const { title, subtitle, description, imageUrl, orderIndex, isActive } = body;

    const carouselRepository = AppDataSource.getRepository(Carousel);
    const carousel = await carouselRepository.findOne({
      where: { id }
    });

    if (!carousel) {
      return NextResponse.json(
        { success: false, message: "Carousel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update carousel properties
    carousel.title = title || carousel.title;
    carousel.subtitle = subtitle !== undefined ? subtitle : carousel.subtitle;
    carousel.description = description || carousel.description;
    carousel.imageUrl = imageUrl || carousel.imageUrl;
    carousel.orderIndex = orderIndex !== undefined ? orderIndex : carousel.orderIndex;
    carousel.isActive = isActive !== undefined ? isActive : carousel.isActive;

    const updatedCarousel = await carouselRepository.save(carousel);

    return NextResponse.json({
      success: true,
      message: "Carousel berhasil diupdate",
      data: updatedCarousel
    });
  } catch (error) {
    console.error("Error updating carousel:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengupdate carousel",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID carousel tidak valid" },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const carouselRepository = AppDataSource.getRepository(Carousel);
    const carousel = await carouselRepository.findOne({
      where: { id }
    });

    if (!carousel) {
      return NextResponse.json(
        { success: false, message: "Carousel tidak ditemukan" },
        { status: 404 }
      );
    }

    await carouselRepository.remove(carousel);

    return NextResponse.json({
      success: true,
      message: "Carousel berhasil dihapus"
    });
  } catch (error) {
    console.error("Error deleting carousel:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal menghapus carousel",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}