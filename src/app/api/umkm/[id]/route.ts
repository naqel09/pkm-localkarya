import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Umkm } from "@/backend/entities/Umkm";
import { ProdukUmkm } from "@/backend/entities/ProdukUmkm";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Mengambil detail UMKM berdasarkan ID
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

        const umkmRepository = AppDataSource.getRepository(Umkm);
        const produkRepository = AppDataSource.getRepository(ProdukUmkm);

        const umkm = await umkmRepository.findOne({
            where: { id: umkmId }
        });

        if (!umkm) {
            return NextResponse.json({
                success: false,
                message: "UMKM tidak ditemukan"
            }, { status: 404 });
        }

        // Ambil produk-produk UMKM
        const produk = await produkRepository.find({
            where: { umkmId: umkmId },
            order: { createdAt: "ASC" }
        });

        return NextResponse.json({
            success: true,
            data: { ...umkm, produk },
            message: "Detail UMKM berhasil diambil"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching UMKM detail:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// PUT - Update UMKM
export async function PUT(request: Request, { params }: RouteParams) {
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

        const formData = await request.formData();
        
        // Extract UMKM data from FormData
        const namaUmkm = formData.get('namaUmkm') as string;
        const deskripsiUmkm = formData.get('deskripsiUmkm') as string;
        const alamatUmkm = formData.get('alamatUmkm') as string;
        const linkGmaps = formData.get('linkGmaps') as string;
        const nomorWhatsapp = formData.get('nomorWhatsapp') as string;
        
        // Handle image upload
        let gambar = null;
        const imageFile = formData.get('gambar') as File;
        if (imageFile && imageFile.size > 0) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', imageFile);
            
            try {
                const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`, {
                    method: 'POST',
                    body: uploadFormData,
                });
                
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    if (uploadResult.success) {
                        gambar = uploadResult.filename;
                    }
                }
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                // Continue without image if upload fails
            }
        }

        // Validasi input
        if (!namaUmkm || !deskripsiUmkm || !alamatUmkm) {
            return NextResponse.json({
                success: false,
                message: "Nama UMKM, deskripsi UMKM, dan alamat UMKM wajib diisi"
            }, { status: 400 });
        }

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

        // Prepare update data
        const updateData = {
            namaUmkm,
            deskripsiUmkm,
            alamatUmkm,
            linkGmaps: linkGmaps || undefined,
            nomorWhatsapp: nomorWhatsapp || undefined
        } as Partial<Umkm>;

        // Only update gambar if new image was uploaded
        if (gambar) {
            updateData.gambar = gambar;
        }

        // Update data UMKM
        await umkmRepository.update(umkmId, updateData);

        // Handle produk updates if provided
        const produkJson = formData.get('produk') as string;
        if (produkJson) {
            try {
                const produkData = JSON.parse(produkJson);
                const produkRepository = AppDataSource.getRepository(ProdukUmkm);
                
                // Delete existing produk for this UMKM
                await produkRepository.delete({ umkmId: umkmId });
                
                // Add new produk if any
                if (Array.isArray(produkData) && produkData.length > 0) {
                    for (let i = 0; i < produkData.length; i++) {
                        const produk = produkData[i];
                        
                        let gambarProduk = null;
                        const produkImageFile = formData.get(`produk-${i}-gambarProduk`) as File;
                        if (produkImageFile && produkImageFile.size > 0) {
                            const uploadFormData = new FormData();
                            uploadFormData.append('file', produkImageFile);
                            
                            try {
                                const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`, {
                                    method: 'POST',
                                    body: uploadFormData,
                                });
                                
                                if (uploadResponse.ok) {
                                    const uploadResult = await uploadResponse.json();
                                    if (uploadResult.success) {
                                        gambarProduk = uploadResult.filename;
                                    }
                                }
                            } catch (uploadError) {
                                console.error('Error uploading produk image:', uploadError);
                            }
                        }
                        
                        const newProduk = produkRepository.create({
                            namaProduk: produk.namaProduk,
                            deskripsiProduk: produk.deskripsiProduk,
                            hargaProduk: Number(produk.hargaProduk),
                            gambarProduk,
                            linkShopee: produk.linkShopee || null,
                            linkTokopedia: produk.linkTokopedia || null,
                            umkmId: umkmId
                        });
                        
                        await produkRepository.save(newProduk);
                    }
                }
            } catch (produkError) {
                console.error('Error processing produk data:', produkError);
            }
        }

        // Ambil data UMKM yang sudah diupdate dengan produk
        const updatedUmkm = await umkmRepository.findOne({
            where: { id: umkmId }
        });

        const produkRepository = AppDataSource.getRepository(ProdukUmkm);
        const produk = await produkRepository.find({
            where: { umkmId: umkmId },
            order: { createdAt: "ASC" }
        });

        return NextResponse.json({
            success: true,
            data: { ...updatedUmkm, produk },
            message: "UMKM berhasil diperbarui"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating UMKM:", error);
        return NextResponse.json({
            success: false,
            message: "Gagal memperbarui UMKM"
        }, { status: 500 });
    }
}

// DELETE - Hapus UMKM
export async function DELETE(request: Request, { params }: RouteParams) {
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

        // Hapus UMKM (produk akan terhapus otomatis karena CASCADE)
        await umkmRepository.remove(umkm);

        return NextResponse.json({
            success: true,
            message: "UMKM berhasil dihapus"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting UMKM:", error);
        return NextResponse.json({
            success: false,
            message: "Gagal menghapus UMKM"
        }, { status: 500 });
    }
}