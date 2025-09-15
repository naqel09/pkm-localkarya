import { AppDataSource } from "@/backend/db/data-source";
import { Destination } from "@/backend/entities/Destination";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Use TypeORM repository
    const destinationRepository = AppDataSource.getRepository(Destination);
    const destinations = await destinationRepository.find({
      order: { createdAt: "DESC" }
    });
    
    return NextResponse.json({
      data: destinations,
      status: 200,
      message: "success"
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: 500
    }, { status: 500 });
  }
}