import { NextResponse } from "next/server";
import {AppDataSource} from "@/backend/db/data-source"
import { Hotel } from "@/backend/entities/Hotel";
import { Room } from "@/backend/entities/Room";

export async function GET(){
    try{
        if(!AppDataSource.isInitialized){
            await AppDataSource.initialize()
        }
        const HotelRepository =AppDataSource.getRepository(Hotel)
        const hotel= await HotelRepository.find({
            relations:["rooms"]
        })
        return NextResponse.json(hotel,{status:200})
    }catch(error){
        console.error("error,tidak bisa melakukan fetching data hotel",error);
        return NextResponse.json({status:500,message:"internal server error"})
    }
}

// --- FUNGSI POST YANG DIPERBAIKI ---
export async function POST(request: Request) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const body = await request.json();
        
        // Cek jika body request berisi hotelId, artinya kita ingin MENAMBAH KAMAR
        if (body.hotelId) {
            const { hotelId, ...roomData } = body;

            const HotelRepository = AppDataSource.getRepository(Hotel);
            const RoomRepository = AppDataSource.getRepository(Room);

            // 2. Cari hotel yang akan ditambahkan kamar
            const hotel = await HotelRepository.findOneBy({ id: hotelId });
            if (!hotel) {
                return NextResponse.json({ message: "Hotel tidak ditemukan" }, { status: 404 });
            }

            // 3. Buat entitas kamar baru dan hubungkan dengan hotel
            const newRoom = RoomRepository.create({
                ...roomData,
                hotel: hotel, // Ini kunci untuk menghubungkan relasi
            });
            
            const savedRoom = await RoomRepository.save(newRoom);
            
            return NextResponse.json(savedRoom, { status: 201 });

        } else {
            // Jika tidak ada hotelId, artinya kita ingin MEMBUAT HOTEL BARU
            const HotelRepository = AppDataSource.getRepository(Hotel);

            const dataHotel = HotelRepository.create({
                image: body.image,
                slug: body.slug,
                title: body.title,
                location: body.location,
                price: body.price,
                description: body.description,
                galeri1: body.galeri1,
                galeri2: body.galeri2,
                galeri3: body.galeri3,
                // Logika ini berguna jika Anda ingin membuat hotel dan kamar sekaligus
                rooms: body.rooms?.map((room: any) => ({
                    name: room.name,
                    description: room.description,
                    price: room.price,
                    image: room.image,
                    galeri1: room.galeri1,
                    galeri2: room.galeri2,
                }))
            });

            const saveData = await HotelRepository.save(dataHotel);
            return NextResponse.json(saveData, { status: 201 });
        }

    } catch (error: any) {
        console.error("Error tidak dapat memproses POST request:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}