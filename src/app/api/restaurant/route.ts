import { NextRequest, NextResponse } from "next/server";
import { RestaurantService } from "@/backend/services/restaurantServices";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const restaurantService = new RestaurantService();

export async function GET(request: NextRequest) {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    return NextResponse.json({
      success: true,
      data: restaurants
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
  try {
    const formData = await request.formData();
    
    // Extract basic restaurant data
    const restaurantData = {
      namaRestaurant: formData.get('namaRestaurant') as string,
      alamatRestaurant: formData.get('alamatRestaurant') as string,
      deskripsiRestaurant: formData.get('deskripsiRestaurant') as string,
    };

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadsDir)) {
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
    
    // Validate data
    const validation = restaurantService.validateRestaurantData(restaurantData);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Data tidak valid",
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    const restaurant = await restaurantService.createRestaurant(restaurantData);
    
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
          
          for (let i = 0; i < validMenus.length; i++) {
            const menuData = validMenus[i];
            if (menuData.namaMenu && menuData.harga) {
              const newMenu = await restaurantService.createMenu({
                namaMenu: menuData.namaMenu,
                harga: parseFloat(menuData.harga.toString()),
                restaurantId: restaurant.id
              });
              createdMenus.push(newMenu);
              console.log(`✅ Created menu ${newMenu.id}: ${menuData.namaMenu}`);
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
      
      for (const [imageKey, filename] of Object.entries(menuImageUpdates)) {
        // Parse menu-{index}-{field} format
        const matches = imageKey.match(/menu-(\d+)-(\w+)/);
        if (matches) {
          const menuIndex = parseInt(matches[1]);
          const field = matches[2]; // fotoMakanan1 or fotoMakanan2
          
          // Find the corresponding menu (assuming menus are in order)
          if (createdMenus && createdMenus[menuIndex]) {
            const menuId = createdMenus[menuIndex].id;
            await restaurantService.updateMenu(menuId, {
              [field]: filename
            });
            console.log(`✅ Updated menu ${menuId} ${field} with ${filename}`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Restaurant berhasil dibuat",
      data: restaurant
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