// src/app/api/hotel/[id]/route.ts
import { NextResponse } from "next/server";
import { HotelService } from "@/backend/services/hotelServices"; 
import { AppDataSource } from "@/backend/db/data-source";
import { Hotel } from "@/backend/entities/Hotel";
import { Room } from "@/backend/entities/Room";
import path from "path";
import fs from "fs/promises";

// GET /api/hotel/[id] -> Ambil detail hotel
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await AppDataSource.initialize().catch(() => {}); // Pastikan DB connect
  const { id } = await params;

  const hotel = await HotelService.getHotelById(Number(id));
  if (!hotel) {
    return NextResponse.json({ message: "Hotel tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(hotel);
}


// DELETE /api/hotel/[id] -> Hapus hotel
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await AppDataSource.initialize().catch(() => {});
  const { id } = await params;

  try {
    const deleted = await HotelService.deleteHotel(Number(id));
    if (!deleted) {
      return NextResponse.json({ message: "Hotel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Hotel berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus hotel" }, { status: 500 });
  }
}
