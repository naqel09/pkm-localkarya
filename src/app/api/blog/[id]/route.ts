import { AppDataSource } from "@/backend/db/data-source";
import { artikelService } from "@/backend/services/artikelServices";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID artikel tidak valid" },
                { status: 400 }
            );
        }
        
        const artikel = await artikelService.getArtikelById(id);
        
        if (!artikel) {
            return NextResponse.json(
                { message: "Artikel tidak ditemukan" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            message: "success",
            status: 200,
            data: artikel
        });
    } catch (error) {
        console.error("Error fetching artikel:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data artikel" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID artikel tidak valid" },
                { status: 400 }
            );
        }
        
        const artikelData = await request.json();
        
        const updatedArtikel = await artikelService.updateArtikel(id, {
            judul: artikelData.judul,
            gambar: artikelData.gambar,
            isiArtikel: artikelData.isiArtikel,
            penulis: artikelData.penulis
        });
        
        if (!updatedArtikel) {
            return NextResponse.json(
                { message: "Artikel tidak ditemukan" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            message: "Artikel berhasil diperbarui",
            data: updatedArtikel,
            status: 200
        });
    } catch (error) {
        console.error("Error updating artikel:", error);
        return NextResponse.json(
            { message: "Gagal memperbarui artikel" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID artikel tidak valid" },
                { status: 400 }
            );
        }
        
        const deleted = await artikelService.deleteArtikel(id);
        
        if (!deleted) {
            return NextResponse.json(
                { message: "Artikel tidak ditemukan" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            message: "Artikel berhasil dihapus",
            status: 200
        });
    } catch (error) {
        console.error("Error deleting artikel:", error);
        return NextResponse.json(
            { message: "Gagal menghapus artikel" },
            { status: 500 }
        );
    }
}