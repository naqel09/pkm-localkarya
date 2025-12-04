import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { PilihKamiFeature } from "@/backend/entities/PilihKami";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID fitur tidak valid" },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const pilihKamiRepository = AppDataSource.getRepository(PilihKamiFeature);
    const feature = await pilihKamiRepository.findOne({
      where: { id }
    });

    if (!feature) {
      return NextResponse.json(
        { success: false, message: "Fitur tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: feature
    });
  } catch (error) {
    console.error("Error fetching feature:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengambil data fitur",
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
        { success: false, message: "ID fitur tidak valid" },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await request.json();
    const { title, description, orderIndex, isActive } = body;

    const pilihKamiRepository = AppDataSource.getRepository(PilihKamiFeature);
    const feature = await pilihKamiRepository.findOne({
      where: { id }
    });

    if (!feature) {
      return NextResponse.json(
        { success: false, message: "Fitur tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update feature properties
    feature.title = title || feature.title;
    feature.description = description || feature.description;
    feature.orderIndex = orderIndex !== undefined ? orderIndex : feature.orderIndex;
    feature.isActive = isActive !== undefined ? isActive : feature.isActive;

    const updatedFeature = await pilihKamiRepository.save(feature);

    return NextResponse.json({
      success: true,
      message: "Fitur berhasil diupdate",
      data: updatedFeature
    });
  } catch (error) {
    console.error("Error updating feature:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengupdate fitur",
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
        { success: false, message: "ID fitur tidak valid" },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const pilihKamiRepository = AppDataSource.getRepository(PilihKamiFeature);
    const feature = await pilihKamiRepository.findOne({
      where: { id }
    });

    if (!feature) {
      return NextResponse.json(
        { success: false, message: "Fitur tidak ditemukan" },
        { status: 404 }
      );
    }

    await pilihKamiRepository.remove(feature);

    return NextResponse.json({
      success: true,
      message: "Fitur berhasil dihapus"
    });
  } catch (error) {
    console.error("Error deleting feature:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal menghapus fitur",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}