import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Room } from "@/backend/entities/Room";

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
    try{
        const { id: idParam } = await params;
        const roomRepo = AppDataSource.getRepository(Room)
        const room = await roomRepo.findOneBy({id:Number(idParam)});

        if(!room){
            return NextResponse.json({message:"room tidak ditemukan",status:404})
        }
        return NextResponse.json(room,{status:200})
    }catch(error){
        console.error("error fetching room",error);
        return NextResponse.json({message:"Internal Server Error"},{status:500})
    }
}

export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){
    try{
        const { id: idParam } = await params;
        const id = parseInt(idParam);
        if(isNaN(id)){
            return NextResponse.json({message:"Invalid ID format"},{status:400})
        }
        const body =await request.json();
        const repo = AppDataSource.getRepository(Room)

        const roomUpdate = await repo.findOneBy({id});
        if(!roomUpdate){
            return NextResponse.json({message:"Room Not Found"},{status:404})
        }

        if(body.hotel){
            delete body.hotel;
        }
        repo.merge(roomUpdate,body);

        const updated = await repo.save(roomUpdate)
        return NextResponse.json(updated,{status:200})
    }catch(error){
        console.error("Error updating room",error)
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}

export async function DELETE(request:Request,{params}:{params:{id:string}}){
    try{
        const id = parseInt(params.id);
        if(isNaN(id)){
            return NextResponse.json({message:"ID kamar Tidak Valid"},{status:400})
        }

        if(!AppDataSource.isInitialized){
            await AppDataSource.initialize();
        }
        const RoomRepo=AppDataSource.getRepository(Room);

        // cari kamar yang akan dihapus
        const roomDelete= await RoomRepo.findOneBy({id:id});

        if(!roomDelete){
            return NextResponse.json({message:"Kamar Tidak ditemukan"},{status:404})
        }

        // hapus kamar dari database
        await RoomRepo.remove(roomDelete)
        return NextResponse.json({message:"data kamar telah berhasil dihapus"},{status:200})

    }catch(error){
        console.error("Gagal menghapus kamar:",error);
        return NextResponse.json({message:"internal server error"},{status:500})
    }
}