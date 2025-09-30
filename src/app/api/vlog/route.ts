import { AppDataSource } from "@/backend/db/data-source";
import { vlogService } from "@/backend/services/vlogServices";
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
            const result = await vlogService.getVlogsPaginated(page, limit);
            return NextResponse.json({
                message: "success",
                status: 200,
                data: result.vlogs,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });
        } else {
            const vlogs = await vlogService.getAllVlogs();
            return NextResponse.json({
                message: "success",
                status: 200,
                data: vlogs
            });
        }
    } catch (error) {
        console.error("Error fetching vlogs:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data vlog" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        console.log('🚀 [VLOG-API] Starting vlog creation...');
        
        if (!AppDataSource.isInitialized) {
            console.log('📊 [VLOG-API] Initializing database connection...');
            await AppDataSource.initialize();
        }

        const body = await request.json();
        console.log('📝 [VLOG-API] Received vlog data:', body);

        const { judulVideo, deskripsiVideo, linkYoutube } = body;

        // Validate required fields
        if (!judulVideo || !deskripsiVideo || !linkYoutube) {
            console.log('❌ [VLOG-API] Missing required fields');
            return NextResponse.json(
                { 
                    message: "Semua field harus diisi",
                    errors: {
                        judulVideo: !judulVideo ? "Judul video harus diisi" : null,
                        deskripsiVideo: !deskripsiVideo ? "Deskripsi video harus diisi" : null,
                        linkYoutube: !linkYoutube ? "Link YouTube harus diisi" : null
                    }
                },
                { status: 400 }
            );
        }

        // Validate YouTube URL format
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
        if (!youtubeRegex.test(linkYoutube)) {
            console.log('❌ [VLOG-API] Invalid YouTube URL format');
            return NextResponse.json(
                { 
                    message: "Format link YouTube tidak valid",
                    errors: {
                        linkYoutube: "Link YouTube harus berupa URL yang valid"
                    }
                },
                { status: 400 }
            );
        }

        const vlogData = {
            judulVideo: judulVideo.trim(),
            deskripsiVideo: deskripsiVideo.trim(),
            linkYoutube: linkYoutube.trim()
        };

        console.log('💾 [VLOG-API] Creating vlog with data:', vlogData);
        
        const newVlog = await vlogService.createVlog(vlogData);
        
        console.log('✅ [VLOG-API] Vlog created successfully:', newVlog);
        
        return NextResponse.json({
            message: "Vlog berhasil dibuat",
            status: 201,
            data: newVlog
        });

    } catch (error) {
        console.error('❌ [VLOG-API] Error creating vlog:', error);
        return NextResponse.json(
            { message: "Gagal membuat vlog" },
            { status: 500 }
        );
    }
}