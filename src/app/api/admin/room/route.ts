import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Room } from "@/backend/entities/Room";
import { Hotel } from "@/backend/entities/Hotel";

// GET - Mengambil semua room atau berdasarkan hotel
export async function GET(request: Request) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const { searchParams } = new URL(request.url);
        const hotelId = searchParams.get('hotelId');
        
        const roomRepository = AppDataSource.getRepository(Room);
        
        let rooms;
        if (hotelId) {
            // Ambil rooms berdasarkan hotel ID
            rooms = await roomRepository.find({
                where: { hotel: { id: parseInt(hotelId) } },
                relations: ["hotel"],
                order: { createdAt: "DESC" }
            });
        } else {
            // Ambil semua rooms
            rooms = await roomRepository.find({
                relations: ["hotel"],
                order: { createdAt: "DESC" }
            });
        }

        return NextResponse.json({
            success: true,
            data: rooms,
            message: "Room data retrieved successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching rooms:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// POST - Membuat room baru
export async function POST(request: Request) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const body = await request.json();
        
        // Validasi input
        const { jenisKamar, luasKamar, fasilitasKamar, hargaPerMalam, banyaknyaTamu, deskripsiKamar, hotelId, gambar1, gambar2, gambar3, gambar360 } = body;
        
        if (!jenisKamar || !luasKamar || !fasilitasKamar || !hargaPerMalam || !banyaknyaTamu || !deskripsiKamar || !hotelId) {
            return NextResponse.json({
                success: false,
                message: "Semua field wajib diisi"
            }, { status: 400 });
        }

        const roomRepository = AppDataSource.getRepository(Room);
        const hotelRepository = AppDataSource.getRepository(Hotel);

        // Validasi hotel exists
        const hotel = await hotelRepository.findOne({ where: { id: hotelId } });
        if (!hotel) {
            return NextResponse.json({
                success: false,
                message: "Hotel tidak ditemukan"
            }, { status: 404 });
        }

        // Buat room baru
        const newRoom = roomRepository.create({
            jenisKamar: jenisKamar.trim(),
            luasKamar: luasKamar.trim(),
            fasilitasKamar: Array.isArray(fasilitasKamar) ? fasilitasKamar.map(f => f.trim()).filter(f => f) : [],
            hargaPerMalam: parseFloat(hargaPerMalam),
            banyaknyaTamu: parseInt(banyaknyaTamu),
            deskripsiKamar: deskripsiKamar.trim(),
            gambar1: gambar1?.trim() || null,
            gambar2: gambar2?.trim() || null,
            gambar3: gambar3?.trim() || null,
            gambar360: gambar360?.trim() || null,
            hotel: hotel
        });

        const savedRoom = await roomRepository.save(newRoom);

        return NextResponse.json({
            success: true,
            data: savedRoom,
            message: "Room berhasil dibuat"
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating room:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}