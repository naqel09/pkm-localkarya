import { AppDataSource } from "@/backend/db/data-source";
import { Artikel } from "@/backend/entities/Artikel";
import { NextResponse } from "next/server";

const artikelRepository = AppDataSource.getRepository(Artikel)

export async function GET(){

    try{
        if(!AppDataSource.isInitialized){
            await AppDataSource.initialize()
        }
        const artikel = await artikelRepository.find();
        return NextResponse.json({message:"success",status:200,data:artikel})
    }catch(error){
        console.error("Error fetching artikels");
        return NextResponse.json(
            {message:"Gagal mengambil data artikel"},
            {status: 500}
        )
    }
}

export async function POST(request:Request){
    try{
        const artikels= await request.json();
        const artikel= artikelRepository.create({
            Judul:artikels.Judul,
            Kategori:artikels.Kategori,
            Lokasi:artikels.Lokasi,
            Tanggal:artikels.Tanggal&&artikels.Tanggal !== ""? artikels.tanggal : new Date().toISOString().split("T")[0],
            Deskripsi:artikels.Deskripsi,
            Gambar:artikels.Gambar,
        })
        await artikelRepository.save(artikel)
        return NextResponse.json({message:"Artikel Berhasil dibuat",data:artikel,status:201})
    }catch(error){
        console.error("Error,tidak bisa membuat hotels:",error);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}