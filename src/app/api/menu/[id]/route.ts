import { NextRequest, NextResponse } from "next/server";
import { RestaurantService } from "@/backend/services/restaurantServices";

const restaurantService = new RestaurantService();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID menu tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate data
    const validation = restaurantService.validateMenuData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Data tidak valid",
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    const menu = await restaurantService.updateMenu(id, body);
    if (!menu) {
      return NextResponse.json(
        { success: false, message: "Menu tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu berhasil diupdate",
      data: menu
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengupdate menu",
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
        { success: false, message: "ID menu tidak valid" },
        { status: 400 }
      );
    }

    const success = await restaurantService.deleteMenu(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Menu tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu berhasil dihapus"
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal menghapus menu",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}