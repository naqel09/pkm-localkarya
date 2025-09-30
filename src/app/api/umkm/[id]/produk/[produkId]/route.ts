import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { ProdukUmkm } from "@/backend/entities/ProdukUmkm";

interface RouteParams {
    params: Promise<{ id: string; produkId: string }>;
}

// GET - Mengambil detail produk berdasarkan ID
export async function GET(request: Request, { params }: RouteParams) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { produkId } = await params;
        const id = parseInt(produkId);

        if (isNaN(id)) {
            return NextResponse.json({
                success: false,
                message: "ID produk tidak valid"
            }, { status: 400 });
        }

        const produkRepository = AppDataSource.getRepository(ProdukUmkm);

        const produk = await produkRepository.findOne({
            where: { id: id }
        });

        if (!produk) {
            return NextResponse.json({
                success: false,
                message: "Produk tidak ditemukan"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: produk,
            message: "Detail produk berhasil diambil"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching produk detail:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// PUT - Update produk
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { produkId } = await params;
        const id = parseInt(produkId);

        if (isNaN(id)) {
            return NextResponse.json({
                success: false,
                message: "ID produk tidak valid"
            }, { status: 400 });
        }

        const body = await request.json();
        const { namaProduk, deskripsiProduk, hargaProduk, gambarProduk, linkShopee, linkTokopedia } = body;

        // Validasi input
        if (!namaProduk || !deskripsiProduk || !hargaProduk) {
            return NextResponse.json({
                success: false,
                message: "Nama produk, deskripsi produk, dan harga produk wajib diisi"
            }, { status: 400 });
        }

        // Validasi harga produk
        const harga = parseFloat(hargaProduk);
        if (isNaN(harga) || harga < 0) {
            return NextResponse.json({
                success: false,
                message: "Harga produk harus berupa angka positif"
            }, { status: 400 });
        }

        const produkRepository = AppDataSource.getRepository(ProdukUmkm);

        const produk = await produkRepository.findOne({
            where: { id: id }
        });

        if (!produk) {
            return NextResponse.json({
                success: false,
                message: "Produk tidak ditemukan"
            }, { status: 404 });
        }

        // Update data produk
        await produkRepository.update(id, {
            namaProduk,
            deskripsiProduk,
            hargaProduk: harga,
            gambarProduk,
            linkShopee,
            linkTokopedia
        });

        // Ambil data produk yang sudah diupdate
        const updatedProduk = await produkRepository.findOne({
            where: { id: id }
        });

        return NextResponse.json({
            success: true,
            data: updatedProduk,
            message: "Produk berhasil diperbarui"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating produk:", error);
        return NextResponse.json({
            success: false,
            message: "Gagal memperbarui produk"
        }, { status: 500 });
    }
}

// DELETE - Hapus produk
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { produkId } = await params;
        const id = parseInt(produkId);

        if (isNaN(id)) {
            return NextResponse.json({
                success: false,
                message: "ID produk tidak valid"
            }, { status: 400 });
        }

        const produkRepository = AppDataSource.getRepository(ProdukUmkm);

        const produk = await produkRepository.findOne({
            where: { id: id }
        });

        if (!produk) {
            return NextResponse.json({
                success: false,
                message: "Produk tidak ditemukan"
            }, { status: 404 });
        }

        // Hapus produk
        await produkRepository.remove(produk);

        return NextResponse.json({
            success: true,
            message: "Produk berhasil dihapus"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting produk:", error);
        return NextResponse.json({
            success: false,
            message: "Gagal menghapus produk"
        }, { status: 500 });
    }
}