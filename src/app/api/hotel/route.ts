// // src/app/api/hotels/route.ts

// import { NextResponse } from "next/server";
// import { AppDataSource } from "@/backend/db/data-source";
// import { Hotel } from "@/backend/entities/Hotel";

// /**
//  * @swagger
//  * /api/hotels:
//  * get:
//  * summary: Mengambil semua data hotel
//  * description: Mengembalikan daftar semua hotel beserta kamar-kamarnya.
//  * responses:
//  * 200:
//  * description: Sukses, mengembalikan array hotel.
//  * 500:
//  * description: Terjadi kesalahan pada server.
//  */
// export async function GET() {
//     try {
//         const hotelRepository = AppDataSource.getRepository(Hotel);
        
//         // Mengambil semua hotel. Karena ada 'eager: true' di entitas Hotel,
//         // semua kamar yang berelasi akan otomatis ikut terambil.
//         const hotels = await hotelRepository.find();

//         return NextResponse.json(hotels, { status: 200 });

//     } catch (error) {
//         console.error("Failed to fetch hotels:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }

// /**
//  * @swagger
//  * /api/hotels:
//  * post:
//  * summary: Membuat hotel baru
//  * description: Membuat entri hotel baru beserta kamar-kamarnya.
//  * requestBody:
//  * required: true
//  * content:
//  * application/json:
//  * schema:
//  * type: object
//  * properties:
//  * // Definisikan properti hotel sesuai entitas
//  * responses:
//  * 201:
//  * description: Hotel berhasil dibuat.
//  * 400:
//  * description: Data yang dikirim tidak valid.
//  * 500:
//  * description: Terjadi kesalahan pada server.
//  */
// export async function POST(request: Request) {
//     try {
//         const body = await request.json();
//         const hotelRepository = AppDataSource.getRepository(Hotel);

//         // Membuat instance Hotel baru dari body request
//         // TypeORM cukup pintar untuk menangani array 'rooms' yang nested
//         const newHotel = hotelRepository.create(body);

//         // Lakukan validasi data di sini sebelum menyimpan (misalnya menggunakan Zod)
//         // ... (contoh: if (!newHotel.title) { ... } )

//         // Menyimpan hotel baru ke database.
//         // Karena ada 'cascade: true' di entitas, semua kamar di dalam body
//         // juga akan otomatis disimpan dan dihubungkan.
//         const savedHotel = await hotelRepository.save(newHotel);

//         return NextResponse.json(savedHotel, { status: 201 });

//     } catch (error: any) {
//         console.error("Failed to create hotel:", error);
//         // Cek jika error karena duplikat slug
//         if (error.code === '23505') { // Kode error postgres untuk unique violation
//              return NextResponse.json({ message: "Slug already exists." }, { status: 400 });
//         }
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }