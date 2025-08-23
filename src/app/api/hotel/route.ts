import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Hotel } from "@/backend/entities/Hotel";
import { Room } from "@/backend/entities/Room";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const hotel = new Hotel();
    hotel.slug = formData.get("slug") as string;
    hotel.title = formData.get("title") as string;
    hotel.location = formData.get("location") as string;
    hotel.price = formData.get("price") as string;
    hotel.description = formData.get("description") as string;

    // Simpan file upload hotel
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const saveFile = async (file: File | null) => {
      if (!file) return "";
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, file.name);
      await fs.writeFile(filePath, buffer);
      return `/uploads/${file.name}`;
    };

    hotel.image = await saveFile(formData.get("image") as File);
    hotel.galeri1 = await saveFile(formData.get("galeri1") as File);
    hotel.galeri2 = await saveFile(formData.get("galeri2") as File);
    hotel.galeri3 = await saveFile(formData.get("galeri3") as File);

    // Rooms
    const rooms: Room[] = [];
    let i = 0;
    while (formData.get(`rooms[${i}][name]`)) {
      const room = new Room();
      room.name = formData.get(`rooms[${i}][name]`) as string;
      room.description = formData.get(`rooms[${i}][description]`) as string;
      room.price = formData.get(`rooms[${i}][price]`) as string;
      room.image = await saveFile(formData.get(`rooms[${i}][image]`) as File);
      room.galeri1 = await saveFile(formData.get(`rooms[${i}][galeri1]`) as File);
      room.galeri2 = await saveFile(formData.get(`rooms[${i}][galeri2]`) as File);
      rooms.push(room);
      i++;
    }

    hotel.rooms = rooms;

    await AppDataSource.manager.save(hotel);

    return NextResponse.json({ message: "Hotel berhasil disimpan" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menyimpan hotel" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const hotelRepo = AppDataSource.getRepository(Hotel).find({
      relations:["rooms"]
    });
    return NextResponse.json(hotelRepo);
    
  } catch (error) {
    console.error("Error GET /api/hotel:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data hotel" },
      { status: 500 }
    );
  }
}

