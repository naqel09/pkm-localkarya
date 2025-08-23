import { NextResponse } from "next/server"
import { AppDataSource } from "@/backend/db/data-source"
import { Artikel } from "@/backend/entities/Artikel"

// mengambil column dari entitas artikel dari database
const ArtikelRepository = AppDataSource.getRepository(Artikel);

export async function DELETE(
    request:Request,
    {params}:{params:{id:string}}
){
    try{
        const artikel = await ArtikelRepository.findOneBy({id:Number(params.id)});
        if(artikel){
            await ArtikelRepository.remove(artikel);
            return NextResponse.json
            (
                {
                    message:"Artikel berhasil di hapus",
                    status:200,
                    data:artikel
                }
            ); 
        }else{
            return NextResponse.json({message:"Artikel tidak ditemukan",status:404})
        }
    }catch(error){
        console.error("Error data artikel tidak terkoneksi ke database",error);
        return NextResponse.json({message:"Server Error",status:500});
    }
}

export async function PUT(request:Request,{params}:{params:{id:string}}){
    try{
        const body = await request.json()
        // cari artikel yang mau di update
        const artikel = await ArtikelRepository.findOne(
            {
                where: {id:Number(params.id)}
            }
        );

        if(artikel){
            return NextResponse.json(
                {
                    message:"data berhasil di update",
                    status:200,
                    data:ArtikelRepository
                }
            );
        }else if(!artikel){
            return NextResponse.json(
                {
                    message:"data artikel tidak ditemukan"
                },
                {
                    status:404
                }
            )
        }else{
            return NextResponse.json(
                {
                    message:"database tidak terhubung"
                },
                {
                    status:500
                }
            )
        }
    }catch(error){
        console.error("gagal update artikel",error)
        return NextResponse.json(
            {
                message:"Internal Server Error",
                error:String(error),
                status:500
            }
        );
    }
}