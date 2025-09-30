import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { ProdukUmkm } from "@/backend/entities/ProdukUmkm";
import { Umkm } from "@/backend/entities/Umkm";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Mengambil produk UMKM berdasarkan UMKM ID
export async function GET(request: Request, { params }: RouteParams) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await params;
        const umkmId = parseInt(id);

        if (isNaN(umkmId)) {
            return NextResponse.json({
                success: false,
                message: "ID UMKM tidak valid"
            }, { status: 400 });
        }

        const produkRepository = AppDataSource.getRepository(ProdukUmkm);

        const produk = await produkRepository.find({
            where: { umkmId: umkmId },
            order: { createdAt: "ASC" }
        });

        return NextResponse.json({
            success: true,
            data: produk,
            message: "Produk UMKM berhasil diambil"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching produk UMKM:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// POST - Tambah produk baru ke UMKM
export async function POST(request: Request, { params }: RouteParams) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { id } = await params;
        const umkmId = parseInt(id);

        if (isNaN(umkmId)) {
            return NextResponse.json({
                success: false,
                message: "ID UMKM tidak valid"
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

        // Periksa apakah UMKM ada
        const umkmRepository = AppDataSource.getRepository(Umkm);
        const umkm = await umkmRepository.findOne({
            where: { id: umkmId }
        });

        if (!umkm) {
            return NextResponse.json({
                success: false,
                message: "UMKM tidak ditemukan"
            }, { status: 404 });
        }

        const produkRepository = AppDataSource.getRepository(ProdukUmkm);

        const produkBaru = produkRepository.create({
            namaProduk,
            deskripsiProduk,
            hargaProduk: harga,
            gambarProduk,
            linkShopee,
            linkTokopedia,
            umkmId
        });

        await produkRepository.save(produkBaru);

        return NextResponse.json({
            success: true,
            data: produkBaru,
            message: "Produk berhasil ditambahkan"
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating produk:", error);
        return NextResponse.json({
            success: false,
            message: "Gagal menambahkan produk"
        }, { status: 500 });
    }
}