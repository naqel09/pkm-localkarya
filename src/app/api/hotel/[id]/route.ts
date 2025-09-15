import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Hotel } from "@/backend/entities/Hotel";

// GET - Mengambil detail hotel berdasarkan ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await params;
        const hotelRepository = AppDataSource.getRepository(Hotel);
        const hotel = await hotelRepository.findOne({
            where: { id: Number(id) },
            relations: ["rooms"]
        });

        if (!hotel) {
            return NextResponse.json({
                success: false,
                message: "Hotel tidak ditemukan"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: hotel,
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

// PUT - Update hotel berdasarkan ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id: idParam } = await params;
        const id = parseInt(idParam);
        if (isNaN(id)) {
            return NextResponse.json({
                success: false,
                message: "Invalid ID format"
            }, { status: 400 });
        }

        const body = await request.json();
        const hotelRepository = AppDataSource.getRepository(Hotel);

        const hotel = await hotelRepository.findOne({
            where: { id },
            relations: ['rooms']
        });

        if (!hotel) {
            return NextResponse.json({
                success: false,
                message: "Hotel tidak ditemukan"
            }, { status: 404 });
        }

        // Validasi input
        const { namaHotel, alamatHotel, googleMapsHotel, deskripsiHotel, fasilitas, gambar1, gambar2, gambar3, rooms } = body;
        
        if (!namaHotel || !alamatHotel || !deskripsiHotel || !fasilitas) {
            return NextResponse.json({
                success: false,
                message: "Nama hotel, alamat, deskripsi, dan fasilitas wajib diisi"
            }, { status: 400 });
        }

        // Update hotel data
        hotel.namaHotel = namaHotel.trim();
        hotel.alamatHotel = alamatHotel.trim();
        hotel.googleMapsHotel = googleMapsHotel?.trim() || null;
        hotel.deskripsiHotel = deskripsiHotel.trim();
        hotel.fasilitas = Array.isArray(fasilitas) ? fasilitas.map(f => f.trim()).filter(f => f) : [];
        hotel.gambar1 = gambar1?.trim() || null;
        hotel.gambar2 = gambar2?.trim() || null;
        hotel.gambar3 = gambar3?.trim() || null;

        const updatedHotel = await hotelRepository.save(hotel);

        // Handle rooms update if provided
        if (rooms && Array.isArray(rooms)) {
            const { Room } = await import("@/backend/entities/Room");
            const roomRepository = AppDataSource.getRepository(Room);

            // Delete existing rooms
            await roomRepository.delete({ hotel: { id } });

            // Add new rooms
            for (const roomData of rooms) {
                if (roomData.jenisKamar && roomData.luasKamar && roomData.deskripsiKamar) {
                    const newRoom = roomRepository.create({
                        jenisKamar: roomData.jenisKamar.trim(),
                        luasKamar: roomData.luasKamar.trim(),
                        fasilitasKamar: Array.isArray(roomData.fasilitasKamar) 
                            ? roomData.fasilitasKamar.map((f: string) => f.trim()).filter((f: string) => f)
                            : [],
                        hargaPerMalam: Number(roomData.hargaPerMalam) || 0,
                        banyaknyaTamu: Number(roomData.banyaknyaTamu) || 1,
                        deskripsiKamar: roomData.deskripsiKamar.trim(),
                        gambar1: roomData.gambar1?.trim() || null,
                        gambar2: roomData.gambar2?.trim() || null,
                        gambar3: roomData.gambar3?.trim() || null,
                        gambar360: roomData.gambar360?.trim() || null,
                        hotel: updatedHotel
                    });

                    await roomRepository.save(newRoom);
                }
            }
        }

        // Get updated hotel with rooms
        const finalHotel = await hotelRepository.findOne({
            where: { id },
            relations: ["rooms"],
        });

        return NextResponse.json({
            success: true,
            data: finalHotel,
            message: "Hotel berhasil diupdate"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating hotel:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// // GET /api/hotel/[id]
// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const hotelRepo = AppDataSource.getRepository(Hotel);
//     const hotel = await hotelRepo.findOne({
//       where: { id: parseInt(params.id) },
//       relations: ["rooms"],
//     });

//     if (!hotel) {
//       return NextResponse.json({ error: "Hotel tidak ditemukan" }, { status: 404 });
//     }

//     return NextResponse.json(hotel, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // PUT /api/hotel/[id]
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const hotelRepo = AppDataSource.getRepository(Hotel);
//     const roomRepo = AppDataSource.getRepository(Room);

//     const body = await request.json();
//     const hotel = await hotelRepo.findOne({
//       where: { id: parseInt(params.id) },
//       relations: ["rooms"],
//     });

//     if (!hotel) {
//       return NextResponse.json({ error: "Hotel tidak ditemukan" }, { status: 404 });
//     }

//     // Update field hotel
//     hotel.image = body.image ?? hotel.image;
//     hotel.slug = body.slug ?? hotel.slug;
//     hotel.title = body.title ?? hotel.title;
//     hotel.location = body.location ?? hotel.location;
//     hotel.price = body.price ?? hotel.price;
//     hotel.description = body.description ?? hotel.description;
//     hotel.galeri1 = body.galeri1 ?? hotel.galeri1;
//     hotel.galeri2 = body.galeri2 ?? hotel.galeri2;
//     hotel.galeri3 = body.galeri3 ?? hotel.galeri3;

//     // Update rooms jika ada di body
//     if (body.rooms) {
//       // hapus rooms lama
//       await roomRepo.delete({ hotel: { id: hotel.id } });

//       // tambahkan rooms baru
//       hotel.rooms = body.rooms.map((r: any) => {
//         const newRoom = new Room();
//         newRoom.name = r.name;
//         newRoom.description = r.description;
//         newRoom.image = r.image;
//         newRoom.price = r.price;
//         newRoom.galeri1 = r.galeri1;
//         newRoom.galeri2 = r.galeri2;
//         return newRoom;
//       });
//     }

//     const updatedHotel = await hotelRepo.save(hotel);

//     return NextResponse.json(updatedHotel, { status: 200 });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// DELETE - Hapus hotel berdasarkan ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await params;
        const hotelRepository = AppDataSource.getRepository(Hotel);
        const hotel = await hotelRepository.findOne({
            where: { id: Number(id) },
            relations: ["rooms"]
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
            message: "Hotel berhasil dihapus",
            data: hotel
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting hotel:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}
