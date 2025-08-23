import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { createDestination } from "@/backend/services/destinationServices";
import { Destination } from "@/backend/entities/Destination";

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(Destination);
    const destinations = await repo.find();

    return NextResponse.json(destinations, { status: 200 });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await req.json();
    const { location, title, days, price, phone, description, image } = body;

    if (!location || !title || !days || !price || !phone || !description || !image) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newDestination = await createDestination({
      location,
      title,
      days,
      price: Number(price),
      phone,
      description,
      image,
    });

    return NextResponse.json(
      { message: "Destination created successfully", data: newDestination },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
