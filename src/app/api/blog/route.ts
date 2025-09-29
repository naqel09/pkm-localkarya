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
        console.log('🚀 [BLOG-API] Starting blog creation...');
        
        if (!AppDataSource.isInitialized) {
            console.log('📊 [BLOG-API] Initializing database connection...');
            await AppDataSource.initialize();
            console.log('✅ [BLOG-API] Database connection initialized');
        }
        
        const artikelData = await request.json();
        console.log('📝 [BLOG-API] Received article data:', {
            judul: artikelData.judul,
            penulis: artikelData.penulis,
            gambar: artikelData.gambar,
            isiArtikelLength: artikelData.isiArtikel?.length || 0
        });
        
        // Validate required fields
        if (!artikelData.judul || !artikelData.isiArtikel || !artikelData.penulis) {
            console.log('❌ [BLOG-API] Validation failed: Missing required fields');
            return NextResponse.json(
                { message: "Judul, isi artikel, dan penulis harus diisi" },
                { status: 400 }
            );
        }
        
        console.log('📊 [BLOG-API] Creating article via service...');
        const artikel = await artikelService.createArtikel({
            judul: artikelData.judul,
            gambar: artikelData.gambar || '',
            isiArtikel: artikelData.isiArtikel,
            penulis: artikelData.penulis
        });
        
        console.log('✅ [BLOG-API] Article created successfully:', artikel.id);
        return NextResponse.json({
            message: "Artikel berhasil dibuat",
            data: artikel,
            status: 201
        });
    } catch (error) {
        console.error('❌ [BLOG-API] Error creating artikel:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
        });
        return NextResponse.json(
            { 
                message: "Internal Server Error", 
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}