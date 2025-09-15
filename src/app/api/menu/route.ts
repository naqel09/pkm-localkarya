import { NextRequest, NextResponse } from "next/server";
import { RestaurantService } from "@/backend/services/restaurantServices";

const restaurantService = new RestaurantService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (restaurantId) {
      // Get menus for specific restaurant
      const id = parseInt(restaurantId);
      if (isNaN(id)) {
        return NextResponse.json(
          { success: false, message: "Restaurant ID tidak valid" },
          { status: 400 }
        );
      }

      const menus = await restaurantService.getMenusByRestaurantId(id);
      return NextResponse.json({
        success: true,
        data: menus
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Restaurant ID diperlukan" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengambil data menu",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const menu = await restaurantService.createMenu(body);
    return NextResponse.json({
      success: true,
      message: "Menu berhasil dibuat",
      data: menu
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating menu:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal membuat menu",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}