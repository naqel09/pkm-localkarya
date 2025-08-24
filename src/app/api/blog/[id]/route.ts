import { NextResponse } from "next/server"
import { AppDataSource } from "@/backend/db/data-source"
import { Artikel } from "@/backend/entities/Artikel"

// mengambil column dari entitas artikel dari database
const ArtikelRepository = AppDataSource.getRepository(Artikel);

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {

    const artikel = await ArtikelRepository.findOneBy({ id: Number(params.id) });

    if (!artikel) {
      return NextResponse.json({ message: "artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(artikel, { status: 200 });
  } catch (error) {
    console.error("Error fetching artikel:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

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

        if(!artikel){
            return NextResponse.json(
                {message:"Artikel Tidak ditemukan"},
                {status:404}
            );
        }
        // Update field artikel (hanya yang dikirim body)
        artikel.Judul = body.Judul??artikel.Judul; //Pakai nullish coalescing (??) → kalau field ada di body, update; kalau tidak ada, tetap pakai nilai lama.
        artikel.Kategori=body.Kategori??artikel.Kategori;
        artikel.Lokasi=body.Lokasi??artikel.Lokasi;
        artikel.Tanggal=body.Tanggal??artikel.Tanggal;
        artikel.Deskripsi=body.Deskripsi??artikel.Deskripsi;
        artikel.Gambar=body.Gambar??artikel.Gambar;
        
        // simpan perubahan ke dalam database
        await ArtikelRepository.save(artikel);

        return NextResponse.json(
            {
                message:"artikel berhasil di update",
                data:artikel
            },
            {
                status:200
            }
        )

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