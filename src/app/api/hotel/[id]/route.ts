import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Hotel } from "@/backend/entities/Hotel";
import { Room } from "@/backend/entities/Room";

// GET - Mengambil hotel berdasarkan ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await params;
        const hotelRepository = AppDataSource.getRepository(Hotel);
        const roomRepository = AppDataSource.getRepository(Room);
        
        const hotel = await hotelRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!hotel) {
            return NextResponse.json({
                success: false,
                message: "Hotel tidak ditemukan"
            }, { status: 404 });
        }

        // Manually fetch rooms for this hotel
        const rooms = await roomRepository.find({
            where: { hotelId: parseInt(id) },
            order: { createdAt: "ASC" }
        });

        return NextResponse.json({
            success: true,
            data: { ...hotel, rooms },
            message: "Hotel data retrieved successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching hotel:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// PUT - Update hotel dan rooms
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await params;
        const body = await request.json();
        
        const { namaHotel, alamatHotel, googleMapsHotel, noWa, deskripsiHotel, fasilitas, gambar1, gambar2, gambar3, rooms } = body;
        
        if (!namaHotel || !alamatHotel || !deskripsiHotel || !fasilitas) {
            return NextResponse.json({
                success: false,
                message: "Nama hotel, alamat, deskripsi, dan fasilitas wajib diisi"
            }, { status: 400 });
        }

        const hotelRepository = AppDataSource.getRepository(Hotel);
        const roomRepository = AppDataSource.getRepository(Room);

        // Find hotel by ID
        const hotel = await hotelRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!hotel) {
            return NextResponse.json({
                success: false,
                message: "Hotel tidak ditemukan"
            }, { status: 404 });
        }

        // Update hotel properties
        hotelRepository.merge(hotel, {
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

        // Save updated hotel
        const updatedHotel = await hotelRepository.save(hotel);

        // Update rooms if provided
        if (rooms && Array.isArray(rooms)) {
            // Delete existing rooms
            await roomRepository.delete({ hotelId: parseInt(id) });

            // Create new rooms
            for (const roomData of rooms) {
                const { jenisKamar, luasKamar, fasilitasKamar, hargaPerMalam, banyaknyaTamu, deskripsiKamar, gambar1, gambar2, gambar3, gambar360 } = roomData;
                
                if (jenisKamar && luasKamar && deskripsiKamar) {
                    const newRoom = roomRepository.create({
                        jenisKamar: jenisKamar.trim(),
                        luasKamar: luasKamar.trim(),
                        fasilitasKamar: Array.isArray(fasilitasKamar) ? fasilitasKamar.map(f => f.trim()).filter(f => f) : [],
                        hargaPerMalam: parseFloat(hargaPerMalam) || 0,
                        banyaknyaTamu: parseInt(banyaknyaTamu) || 1,
                        deskripsiKamar: deskripsiKamar.trim(),
                        gambar1: gambar1?.trim() || null,
                        gambar2: gambar2?.trim() || null,
                        gambar3: gambar3?.trim() || null,
                        gambar360: gambar360?.trim() || null,
                        hotelId: parseInt(id)
                    });

                    await roomRepository.save(newRoom);
                }
            }
        }

        // Fetch updated hotel with rooms
        const finalRooms = await roomRepository.find({
            where: { hotelId: parseInt(id) },
            order: { createdAt: "ASC" }
        });

        return NextResponse.json({
            success: true,
            data: { ...updatedHotel, rooms: finalRooms },
            message: "Hotel berhasil diperbarui"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating hotel:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// DELETE - Menghapus hotel
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await params;
        const hotelRepository = AppDataSource.getRepository(Hotel);

        const hotel = await hotelRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!hotel) {
            return NextResponse.json({
                success: false,
                message: "Hotel tidak ditemukan"
            }, { status: 404 });
        }

        await hotelRepository.remove(hotel);

        return NextResponse.json({
            success: true,
            message: "Hotel berhasil dihapus"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting hotel:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}