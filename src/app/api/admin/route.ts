import { AppDataSource } from "@/backend/db/data-source";
import { Destination } from "@/backend/entities/Destination";
import { NextResponse } from "next/server";


const WisataRepository = AppDataSource.getRepository(Destination);

export async function GET(){
  try{
    if(!AppDataSource.isInitialized){
      await AppDataSource.initialize()
    }
    const destinasi = await WisataRepository.find();
    return NextResponse.json({data:destinasi,status:200,message:"success"})
  }catch(error){
    console.error("error,tidak bisa melakukan fetching data destinasi",error)
    return NextResponse.json({message:"internal server error",status:500})
  }
}

export async function POST(request:Request){
  try{
    const body = await request.json();
    const destinasi = WisataRepository.create(body);
    await WisataRepository.save(destinasi);
    return NextResponse.json({data:destinasi,status:201,message:"Berhasil membuat data destinasi"})
  }catch(error){
    console.error("error,tidak dapat membuat data destinasi",error)
    return NextResponse.json({message:"internal server error",status:500})
  }
}