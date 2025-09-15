import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Room } from "@/backend/entities/Room";
import { Hotel } from "@/backend/entities/Hotel";

// GET - Mengambil detail room berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const roomRepository = AppDataSource.getRepository(Room);
        const room = await roomRepository.findOne({
            where: { id: Number(params.id) },
            relations: ["hotel"]
        });

        if (!room) {
            return NextResponse.json({
                success: false,
                message: "Room tidak ditemukan"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: room,
            message: "Room data retrieved successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching room:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// PUT - Update room berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({
                success: false,
                message: "Invalid ID format"
            }, { status: 400 });
        }

        const body = await request.json();
        const roomRepository = AppDataSource.getRepository(Room);
        const hotelRepository = AppDataSource.getRepository(Hotel);

        const room = await roomRepository.findOne({
            where: { id },
            relations: ['hotel']
        });

        if (!room) {
            return NextResponse.json({
                success: false,
                message: "Room tidak ditemukan"
            }, { status: 404 });
        }

        // Validasi input
        const { jenisKamar, luasKamar, fasilitasKamar, hargaPerMalam, banyaknyaTamu, deskripsiKamar, hotelId } = body;
        
        if (!jenisKamar || !luasKamar || !fasilitasKamar || !hargaPerMalam || !banyaknyaTamu || !deskripsiKamar) {
            return NextResponse.json({
                success: false,
                message: "Semua field wajib diisi"
            }, { status: 400 });
        }

        // Jika hotelId berubah, validasi hotel baru
        if (hotelId && hotelId !== room.hotel.id) {
            const hotel = await hotelRepository.findOne({ where: { id: hotelId } });
            if (!hotel) {
                return NextResponse.json({
                    success: false,
                    message: "Hotel tidak ditemukan"
                }, { status: 404 });
            }
            room.hotel = hotel;
        }

        // Update room data
        room.jenisKamar = jenisKamar.trim();
        room.luasKamar = luasKamar.trim();
        room.fasilitasKamar = Array.isArray(fasilitasKamar) ? fasilitasKamar.map(f => f.trim()).filter(f => f) : [];
        room.hargaPerMalam = parseFloat(hargaPerMalam);
        room.banyaknyaTamu = parseInt(banyaknyaTamu);
        room.deskripsiKamar = deskripsiKamar.trim();

        const updatedRoom = await roomRepository.save(room);

        return NextResponse.json({
            success: true,
            data: updatedRoom,
            message: "Room berhasil diupdate"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating room:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// DELETE - Hapus room berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const roomRepository = AppDataSource.getRepository(Room);
        const room = await roomRepository.findOne({
            where: { id: Number(params.id) },
            relations: ["hotel"]
        });

        if (!room) {
            return NextResponse.json({
                success: false,
                message: "Room tidak ditemukan"
            }, { status: 404 });
        }

        await roomRepository.remove(room);

        return NextResponse.json({
            success: true,
            message: "Room berhasil dihapus",
            data: room
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting room:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}