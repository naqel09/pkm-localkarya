import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppDataSource } from "@/backend/db/data-source";
import { Restaurant } from "@/backend/entities/Restaurant";
import { Menu } from "@/backend/entities/Menu";

export async function GET(request: NextRequest) {
  try {
    // Initialize database directly like other API routes
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Use efficient database queries instead of service layer
    const restaurantRepository = AppDataSource.getRepository(Restaurant);
    const menuRepository = AppDataSource.getRepository(Menu);
    
    // Get all restaurants
    const restaurants = await restaurantRepository.find({
      order: {
        createdAt: "DESC"
      }
    });
    
    // Get all menus in one query
    const allMenus = await menuRepository.find({
      order: {
        createdAt: "DESC"
      }
    });
    
    // Group menus by restaurant ID
    const menusByRestaurant = allMenus.reduce((acc, menu) => {
      if (!acc[menu.restaurantId]) {
        acc[menu.restaurantId] = [];
      }
      acc[menu.restaurantId].push(menu);
      return acc;
    }, {} as Record<number, typeof allMenus>);
    
    // Attach menus to restaurants
    const restaurantsWithMenus = restaurants.map(restaurant => ({
      ...restaurant,
      menus: menusByRestaurant[restaurant.id] || []
    }));
    
    return NextResponse.json({
      success: true,
      data: restaurantsWithMenus
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengambil data restaurant",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('🍴 Starting restaurant creation...');
  
  try {
    const formData = await request.formData();
    console.log('📎 Received form data');
    
    // Log received form data for debugging
    console.log('Form data entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    // Extract basic restaurant data
    const restaurantData = {
      namaRestaurant: formData.get('namaRestaurant') as string,
      alamatRestaurant: formData.get('alamatRestaurant') as string,
      deskripsiRestaurant: formData.get('deskripsiRestaurant') as string,
      gmaps: formData.get('gmaps') as string || null,
      noWa: formData.get('noWa') as string || null,
      operatingHours: formData.get('operatingHours') as string || null,
      capacity: formData.get('capacity') as string || null,
    };
    
    console.log('🏢 Restaurant data extracted:', restaurantData);
    
    // Validate required fields early
    if (!restaurantData.namaRestaurant || !restaurantData.namaRestaurant.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Nama restaurant harus diisi'
      }, { status: 400 });
    }
    
    if (!restaurantData.alamatRestaurant || !restaurantData.alamatRestaurant.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Alamat restaurant harus diisi'
      }, { status: 400 });
    }
    
    if (!restaurantData.deskripsiRestaurant || !restaurantData.deskripsiRestaurant.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Deskripsi restaurant harus diisi'
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadsDir)) {
      console.log('📁 Creating uploads directory...');
      await mkdir(uploadsDir, { recursive: true });
    }

    // Handle image uploads - actually upload the files
    const imageFields = ['gambar1', 'gambar2', 'gambar3', 'gambar4', 'gambar5', 'gambar6'];
    for (const field of imageFields) {
      const file = formData.get(field) as File;
      if (file && file.size > 0) {
        try {
          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
              success: false,
              message: `Invalid file type for ${field}. Only JPEG, PNG, GIF, and WebP are allowed.`
            }, { status: 400 });
          }

          // Validate file size (5MB limit)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            return NextResponse.json({
              success: false,
              message: `File ${field} too large. Maximum size is 5MB.`
            }, { status: 400 });
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Create unique filename
          const timestamp = Date.now();
          const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `restaurant-${timestamp}-${originalName}`;
          
          const filePath = join(uploadsDir, filename);
          await writeFile(filePath, buffer);
          
          // Store only the filename in database
          (restaurantData as any)[field] = filename;
        } catch (uploadError) {
          console.error(`Error uploading ${field}:`, uploadError);
          return NextResponse.json({
            success: false,
            message: `Failed to upload ${field}`
          }, { status: 500 });
        }
      }
    }

    // Handle menu photos
    const menuPhotoFields = ['fotoMenu1', 'fotoMenu2', 'fotoMenu3'];
    for (const field of menuPhotoFields) {
      const file = formData.get(field) as File;
      if (file && file.size > 0) {
        try {
          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
              success: false,
              message: `Invalid file type for ${field}. Only JPEG, PNG, GIF, and WebP are allowed.`
            }, { status: 400 });
          }

          // Validate file size (5MB limit)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            return NextResponse.json({
              success: false,
              message: `File ${field} too large. Maximum size is 5MB.`
            }, { status: 400 });
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Create unique filename
          const timestamp = Date.now();
          const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `menu-${timestamp}-${originalName}`;
          
          const filePath = join(uploadsDir, filename);
          await writeFile(filePath, buffer);
          
          // Store only the filename in database
          (restaurantData as any)[field] = filename;
        } catch (uploadError) {
          console.error(`Error uploading ${field}:`, uploadError);
          return NextResponse.json({
            success: false,
            message: `Failed to upload ${field}`
          }, { status: 500 });
        }
      }
    }
    
    // Handle menu item images (from individual menu items)
    const menuImageUpdates: {[key: string]: string} = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('menu-') && value instanceof File && value.size > 0) {
        console.log(`🍽️ Processing menu image: ${key}`);
        try {
          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(value.type)) {
            return NextResponse.json({
              success: false,
              message: `Invalid file type for ${key}. Only JPEG, PNG, GIF, and WebP are allowed.`
            }, { status: 400 });
          }

          // Validate file size (5MB limit)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (value.size > maxSize) {
            return NextResponse.json({
              success: false,
              message: `File ${key} too large. Maximum size is 5MB.`
            }, { status: 400 });
          }

          const bytes = await value.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Create unique filename
          const timestamp = Date.now();
          const originalName = value.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `menu-item-${timestamp}-${originalName}`;
          
          const filePath = join(uploadsDir, filename);
          await writeFile(filePath, buffer);
          console.log(`✅ Menu image saved: ${filename}`);
          
          // Store for later menu update
          menuImageUpdates[key] = filename;
        } catch (uploadError) {
          console.error(`Error uploading menu image ${key}:`, uploadError);
          return NextResponse.json({
            success: false,
            message: `Failed to upload menu image ${key}`
          }, { status: 500 });
        }
      }
    }
    
    // Validate data inline (same logic as service)
    console.log('✅ Validating restaurant data...');
    const validationErrors: string[] = [];
    
    if (!restaurantData.namaRestaurant || restaurantData.namaRestaurant.trim() === '') {
      validationErrors.push('Nama restaurant harus diisi');
    }
    if (!restaurantData.alamatRestaurant || restaurantData.alamatRestaurant.trim() === '') {
      validationErrors.push('Alamat restaurant harus diisi');
    }
    if (!restaurantData.deskripsiRestaurant || restaurantData.deskripsiRestaurant.trim() === '') {
      validationErrors.push('Deskripsi restaurant harus diisi');
    }
    
    // Validate WhatsApp number if provided
    if (restaurantData.noWa && restaurantData.noWa.trim() !== '') {
      const waRegex = /^62\d{9,13}$/;
      if (!waRegex.test(restaurantData.noWa.trim())) {
        validationErrors.push('Nomor WhatsApp harus dimulai dengan 62 dan memiliki 11-15 digit');
      }
    }
    
    if (validationErrors.length > 0) {
      console.log('❌ Validation failed:', validationErrors);
      return NextResponse.json(
        { 
          success: false, 
          message: "Data tidak valid",
          errors: validationErrors
        },
        { status: 400 }
      );
    }

    console.log('🏢 Creating restaurant in database...');
    
    // Initialize database directly like other API routes
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database initialized successfully');
    }
    
    // Create restaurant directly using AppDataSource
    const restaurantRepository = AppDataSource.getRepository(Restaurant);
    const restaurant = restaurantRepository.create({
      namaRestaurant: restaurantData.namaRestaurant.trim(),
      alamatRestaurant: restaurantData.alamatRestaurant.trim(),
      deskripsiRestaurant: restaurantData.deskripsiRestaurant.trim(),
      gmaps: restaurantData.gmaps ? restaurantData.gmaps.trim() : null,
      noWa: restaurantData.noWa ? restaurantData.noWa.trim() : null,
      operatingHours: restaurantData.operatingHours ? restaurantData.operatingHours.trim() : null,
      capacity: restaurantData.capacity ? restaurantData.capacity.trim() : null,
      ...Object.fromEntries(imageFields.map(field => [field, (restaurantData as any)[field] || null])),
      ...Object.fromEntries(menuPhotoFields.map(field => [field, (restaurantData as any)[field] || null]))
    });
    
    const savedRestaurant = await restaurantRepository.save(restaurant);
    console.log('✅ Restaurant created successfully:', savedRestaurant.id);
    
    // Handle menus if provided
    const menusJson = formData.get('menus') as string;
    const createdMenus: any[] = [];
    if (menusJson) {
      try {
        const menus = JSON.parse(menusJson);
        console.log('🍽️ Processing menus for new restaurant:', menus);
        
        if (Array.isArray(menus)) {
          // Filter out empty menu items
          const validMenus = menus.filter(menuData => 
            menuData.namaMenu && menuData.namaMenu.trim() !== '' && 
            menuData.harga && !isNaN(parseFloat(menuData.harga.toString()))
          );
          console.log('🍽️ Valid menus to create:', validMenus.length);
          
          const menuRepository = AppDataSource.getRepository(Menu);
          
          for (let i = 0; i < validMenus.length; i++) {
            const menuData = validMenus[i];
            if (menuData.namaMenu && menuData.harga) {
              const newMenu = menuRepository.create({
                namaMenu: menuData.namaMenu,
                harga: parseFloat(menuData.harga.toString()),
                restaurantId: savedRestaurant.id
              });
              
              const savedMenu = await menuRepository.save(newMenu);
              createdMenus.push(savedMenu);
              console.log(`✅ Created menu ${savedMenu.id}: ${menuData.namaMenu}`);
            }
          }
        }
      } catch (menuError) {
        console.error('Error processing menus:', menuError);
        // Continue without failing the restaurant creation
      }
    }
    
    // Update menu items with uploaded images
    if (Object.keys(menuImageUpdates).length > 0 && createdMenus.length > 0) {
      console.log('🍴 Updating newly created menu items with images:', menuImageUpdates);
      
      const menuRepository = AppDataSource.getRepository(Menu);
      
      for (const [imageKey, filename] of Object.entries(menuImageUpdates)) {
        // Parse menu-{index}-{field} format
        const matches = imageKey.match(/menu-(\d+)-(\w+)/);
        if (matches) {
          const menuIndex = parseInt(matches[1]);
          const field = matches[2]; // fotoMakanan1 or fotoMakanan2
          
          // Find the corresponding menu (assuming menus are in order)
          if (createdMenus && createdMenus[menuIndex]) {
            const menuId = createdMenus[menuIndex].id;
            await menuRepository.update(menuId, {
              [field]: filename
            });
            console.log(`✅ Updated menu ${menuId} ${field} with ${filename}`);
          }
        }
      }
    }

    console.log('✅ Restaurant creation completed successfully');
    return NextResponse.json({
      success: true,
      message: "Restaurant berhasil dibuat",
      data: savedRestaurant
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal membuat restaurant",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}