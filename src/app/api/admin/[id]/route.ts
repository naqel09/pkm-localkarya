import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Destination } from "@/backend/entities/Destination";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(Destination);
    const destination = await repo.findOneBy({ id: Number(params.id) });

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 });
    }

    return NextResponse.json(destination, { status: 200 });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await req.json();
    const repo = AppDataSource.getRepository(Destination);

    let destination = await repo.findOneBy({ id: Number(params.id) });
    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 });
    }

    repo.merge(destination, body);
    const updated = await repo.save(destination);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(Destination);
    const destination = await repo.findOneBy({ id: Number(params.id) });

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 });
    }

    await repo.remove(destination);
    return NextResponse.json({ message: "Destination deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
