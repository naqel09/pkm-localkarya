import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Hotel } from "@/backend/entities/Hotel";
import { Room } from "@/backend/entities/Room";

// GET - Mengambil semua data hotel
export async function GET() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const hotelRepository = AppDataSource.getRepository(Hotel);
        const roomRepository = AppDataSource.getRepository(Room);
        
        const hotels = await hotelRepository.find({
            order: {
                createdAt: "DESC"
            }
        });

        // Manually fetch rooms for each hotel like Restaurant/Menu pattern
        const hotelsWithRooms = await Promise.all(
            hotels.map(async (hotel) => {
                const rooms = await roomRepository.find({
                    where: { hotelId: hotel.id },
                    order: { createdAt: "ASC" }
                });
                return { ...hotel, rooms };
            })
        );

        return NextResponse.json({
            success: true,
            data: hotelsWithRooms,
            message: "Hotel data retrieved successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching hotels:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// POST - Membuat hotel baru
export async function POST(request: Request) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const body = await request.json();
        
        // Validasi input
        const { namaHotel, alamatHotel, googleMapsHotel, noWa, deskripsiHotel, fasilitas, gambar1, gambar2, gambar3 } = body;
        
        if (!namaHotel || !alamatHotel || !deskripsiHotel || !fasilitas) {
            return NextResponse.json({
                success: false,
                message: "Nama hotel, alamat, deskripsi, dan fasilitas wajib diisi"
            }, { status: 400 });
        }

        const hotelRepository = AppDataSource.getRepository(Hotel);

        // Buat hotel baru
        const newHotel = hotelRepository.create({
            namaHotel: namaHotel.trim(),
            alamatHotel: alamatHotel.trim(),
            googleMapsHotel: googleMapsHotel?.trim() || null,
            noWa: noWa?.trim() || null,
            deskripsiHotel: deskripsiHotel.trim(),
            fasilitas: Array.isArray(fasilitas) ? fasilitas.map(f => f.trim()).filter(f => f) : [],
            gambar1: gambar1?.trim() || null,
            gambar2: gambar2?.trim() || null,
            gambar3: gambar3?.trim() || null
        });

        const savedHotel = await hotelRepository.save(newHotel);

        return NextResponse.json({
            success: true,
            data: savedHotel,
            message: "Hotel berhasil dibuat"
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating hotel:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}