import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Umkm } from "@/backend/entities/Umkm";
import { ProdukUmkm } from "@/backend/entities/ProdukUmkm";

// GET - Mengambil semua data UMKM
export async function GET() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const umkmRepository = AppDataSource.getRepository(Umkm);
        const produkRepository = AppDataSource.getRepository(ProdukUmkm);
        
        const umkmList = await umkmRepository.find({
            order: {
                createdAt: "DESC"
            }
        });

        // Manually fetch produk for each UMKM
        const umkmWithProduk = await Promise.all(
            umkmList.map(async (umkm) => {
                const produk = await produkRepository.find({
                    where: { umkmId: umkm.id },
                    order: { createdAt: "ASC" }
                });
                return { ...umkm, produk };
            })
        );

        return NextResponse.json({
            success: true,
            data: umkmWithProduk,
            message: "UMKM data retrieved successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching UMKM:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

// POST - Membuat UMKM baru
export async function POST(request: Request) {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const formData = await request.formData();
        console.log('📎 Received UMKM form data');
        
        // Log received form data for debugging
        console.log('Form data entries:');
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        // Extract basic UMKM data
        const umkmData = {
            namaUmkm: formData.get('namaUmkm') as string,
            alamatUmkm: formData.get('alamatUmkm') as string,
            deskripsiUmkm: formData.get('deskripsiUmkm') as string,
            linkGmaps: formData.get('linkGmaps') as string,
            nomorWhatsapp: formData.get('nomorWhatsapp') as string,
        };

        console.log('🏢 UMKM data extracted:', umkmData);

        // Validate required fields
        if (!umkmData.namaUmkm || !umkmData.namaUmkm.trim()) {
            return NextResponse.json({
                success: false,
                message: "Nama UMKM harus diisi"
            }, { status: 400 });
        }

        if (!umkmData.alamatUmkm || !umkmData.alamatUmkm.trim()) {
            return NextResponse.json({
                success: false,
                message: "Alamat UMKM harus diisi"
            }, { status: 400 });
        }

        if (!umkmData.deskripsiUmkm || !umkmData.deskripsiUmkm.trim()) {
            return NextResponse.json({
                success: false,
                message: "Deskripsi UMKM harus diisi"
            }, { status: 400 });
        }

        // Handle file upload for UMKM image
        let gambarFilename = null;
        const gambarFile = formData.get('gambar') as File;
        if (gambarFile && gambarFile.size > 0) {
            console.log('📸 Processing UMKM image:', gambarFile.name);
            
            try {
                const uploadResponse = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    body: (() => {
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', gambarFile);
                        return uploadFormData;
                    })()
                });

                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    if (uploadResult.success) {
                        gambarFilename = uploadResult.filename;
                        console.log('✅ UMKM image uploaded:', gambarFilename);
                    }
                } else {
                    console.error('❌ Failed to upload UMKM image');
                }
            } catch (uploadError) {
                console.error('❌ Error uploading UMKM image:', uploadError);
            }
        }

        const umkmRepository = AppDataSource.getRepository(Umkm);
        
        // Create new UMKM
        const newUmkm = umkmRepository.create({
            namaUmkm: umkmData.namaUmkm.trim(),
            deskripsiUmkm: umkmData.deskripsiUmkm.trim(),
            alamatUmkm: umkmData.alamatUmkm.trim(),
            linkGmaps: umkmData.linkGmaps?.trim() || undefined,
            nomorWhatsapp: umkmData.nomorWhatsapp?.trim() || undefined,
            gambar: gambarFilename || undefined
        });

        const savedUmkm = await umkmRepository.save(newUmkm);
        console.log('✅ UMKM created with ID:', savedUmkm.id);

        // Handle produk data
        const produkJson = formData.get('produk') as string;
        const savedProduk: ProdukUmkm[] = [];
        
        if (produkJson) {
            try {
                const produkData = JSON.parse(produkJson);
                console.log('📦 Processing', produkData.length, 'products');
                
                if (Array.isArray(produkData) && produkData.length > 0) {
                    const produkRepository = AppDataSource.getRepository(ProdukUmkm);
                    
                    for (let i = 0; i < produkData.length; i++) {
                        const produk = produkData[i];
                        
                        // Handle produk image upload
                        let produkGambarFilename = null;
                        const produkImageFile = formData.get(`produk-${i}-gambarProduk`) as File;
                        
                        if (produkImageFile && produkImageFile.size > 0) {
                            console.log(`📸 Processing produk ${i} image:`, produkImageFile.name);
                            
                            try {
                                const uploadResponse = await fetch('http://localhost:3000/api/upload', {
                                    method: 'POST',
                                    body: (() => {
                                        const uploadFormData = new FormData();
                                        uploadFormData.append('file', produkImageFile);
                                        return uploadFormData;
                                    })()
                                });

                                if (uploadResponse.ok) {
                                    const uploadResult = await uploadResponse.json();
                                    if (uploadResult.success) {
                                        produkGambarFilename = uploadResult.filename;
                                        console.log(`✅ Produk ${i} image uploaded:`, produkGambarFilename);
                                    }
                                }
                            } catch (uploadError) {
                                console.error(`❌ Error uploading produk ${i} image:`, uploadError);
                            }
                        }
                        
                        // Create produk
                        const newProduk = produkRepository.create({
                            namaProduk: produk.namaProduk,
                            deskripsiProduk: produk.deskripsiProduk,
                            hargaProduk: Number(produk.hargaProduk),
                            gambarProduk: produkGambarFilename || undefined,
                            linkShopee: produk.linkShopee || undefined,
                            linkTokopedia: produk.linkTokopedia || undefined,
                            umkmId: savedUmkm.id
                        });

                        const savedProdukItem = await produkRepository.save(newProduk);
                        savedProduk.push(savedProdukItem);
                    }
                }
            } catch (error) {
                console.error('❌ Error processing produk data:', error);
            }
        }

        return NextResponse.json({
            success: true,
            data: { ...savedUmkm, produk: savedProduk },
            message: "UMKM berhasil dibuat"
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating UMKM:", error);
        return NextResponse.json({
            success: false,
            message: "Gagal membuat UMKM"
        }, { status: 500 });
    }
}