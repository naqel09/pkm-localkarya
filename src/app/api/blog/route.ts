import { AppDataSource } from "@/backend/db/data-source";
import { artikelService } from "@/backend/services/artikelServices";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        
        if (url.searchParams.has('page')) {
            const result = await artikelService.getArtikelsPaginated(page, limit);
            return NextResponse.json({
                message: "success",
                status: 200,
                data: result.articles,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        } else {
            const articles = await artikelService.getAllArtikels();
            return NextResponse.json({
                message: "success",
                status: 200,
                data: articles
            });
        }
    } catch (error) {
        console.error("Error fetching artikels:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data artikel" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const artikelData = await request.json();
        
        // Validate required fields
        if (!artikelData.judul || !artikelData.isiArtikel || !artikelData.penulis) {
            return NextResponse.json(
                { message: "Judul, isi artikel, dan penulis harus diisi" },
                { status: 400 }
            );
        }
        
        const artikel = await artikelService.createArtikel({
            judul: artikelData.judul,
            gambar: artikelData.gambar || '',
            isiArtikel: artikelData.isiArtikel,
            penulis: artikelData.penulis
        });
        
        return NextResponse.json({
            message: "Artikel berhasil dibuat",
            data: artikel,
            status: 201
        });
    } catch (error) {
        console.error("Error creating artikel:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}