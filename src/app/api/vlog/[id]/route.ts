import { AppDataSource } from "@/backend/db/data-source";
import { vlogService } from "@/backend/services/vlogServices";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const vlog = await vlogService.getVlogById(parseInt(id));
        
        if (!vlog) {
            return NextResponse.json(
                { message: "Vlog tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "success",
            status: 200,
            data: vlog
        });
    } catch (error) {
        console.error("Error fetching vlog:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data vlog" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const body = await request.json();
        const { judulVideo, deskripsiVideo, linkYoutube } = body;

        // Validate required fields
        if (!judulVideo || !deskripsiVideo || !linkYoutube) {
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

        const updatedVlog = await vlogService.updateVlog(parseInt(id), vlogData);

        if (!updatedVlog) {
            return NextResponse.json(
                { message: "Vlog tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Vlog berhasil diperbarui",
            status: 200,
            data: updatedVlog
        });

    } catch (error) {
        console.error("Error updating vlog:", error);
        return NextResponse.json(
            { message: "Gagal memperbarui vlog" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const deleted = await vlogService.deleteVlog(parseInt(id));

        if (!deleted) {
            return NextResponse.json(
                { message: "Vlog tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Vlog berhasil dihapus",
            status: 200
        });

    } catch (error) {
        console.error("Error deleting vlog:", error);
        return NextResponse.json(
            { message: "Gagal menghapus vlog" },
            { status: 500 }
        );
    }
}