import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppDataSource } from "@/backend/db/data-source";
import { Restaurant } from "@/backend/entities/Restaurant";
import { Menu } from "@/backend/entities/Menu";
import { RestaurantService } from "@/backend/services/restaurantServices";

// Temporary service for complex PUT/DELETE operations
const restaurantService = new RestaurantService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID restaurant tidak valid" },
        { status: 400 }
      );
    }

    // Initialize database directly like other API routes
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Use efficient database queries instead of service layer
    const restaurantRepository = AppDataSource.getRepository(Restaurant);
    const menuRepository = AppDataSource.getRepository(Menu);
    
    // Get restaurant by ID
    const restaurant = await restaurantRepository.findOne({
      where: { id }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Restaurant tidak ditemukan" },
        { status: 404 }
      );
    }
    
    // Get menus for this restaurant
    const menus = await menuRepository.find({
      where: { restaurantId: id },
      order: { createdAt: "DESC" }
    });
    
    // Attach menus to restaurant
    const restaurantWithMenus = {
      ...restaurant,
      menus
    };

    return NextResponse.json({
      success: true,
      data: restaurantWithMenus
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID restaurant tidak valid" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Initialize database directly like other API routes
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const restaurantRepository = AppDataSource.getRepository(Restaurant);
    
    // Get existing restaurant data first
    const existingRestaurant = await restaurantRepository.findOne({
      where: { id }
    });
    if (!existingRestaurant) {
      return NextResponse.json(
        { success: false, message: "Restaurant tidak ditemukan" },
        { status: 404 }
      );
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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Handle image uploads - only update if new file is provided
    const imageFields = ['gambar1', 'gambar2', 'gambar3', 'gambar4', 'gambar5', 'gambar6'];
    console.log('🖼️ Processing image fields:', imageFields);
    for (const field of imageFields) {
      const file = formData.get(field) as File;
      console.log(`🔍 Checking ${field}:`, file ? `File(${file.name}, ${file.size} bytes)` : 'No file');
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
          console.log('⬇️ Saving file to:', filePath);
          await writeFile(filePath, buffer);
          console.log('✅ File saved successfully:', filename);
          
          // Store only the filename in database
          (restaurantData as any)[field] = filename;
          console.log(`💾 Stored ${field} in database:`, filename);
        } catch (uploadError) {
          console.error(`Error uploading ${field}:`, uploadError);
          return NextResponse.json({
            success: false,
            message: `Failed to upload ${field}`
          }, { status: 500 });
        }
      } else {
        // Keep existing image if no new file provided
        if (existingRestaurant[field as keyof typeof existingRestaurant]) {
          (restaurantData as any)[field] = existingRestaurant[field as keyof typeof existingRestaurant];
        }
      }
    }

    // Handle menu photos - only update if new file is provided
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
      } else {
        // Keep existing menu photo if no new file provided
        if (existingRestaurant[field as keyof typeof existingRestaurant]) {
          (restaurantData as any)[field] = existingRestaurant[field as keyof typeof existingRestaurant];
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
    console.log('📋 Final restaurant data to save:', restaurantData);
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

    const restaurant = await restaurantService.updateRestaurant(id, restaurantData);
    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Restaurant tidak ditemukan" },
        { status: 404 }
      );
    }
    
    // Handle menus data (create/update menu items)
    const menusJson = formData.get('menus') as string;
    if (menusJson) {
      try {
        const menus = JSON.parse(menusJson);
        console.log('🍽️ Processing menus data:', menus);
        
        if (Array.isArray(menus)) {
          // Get existing menus for this restaurant
          const existingMenus = await restaurantService.getMenusByRestaurantId(id);
          console.log('🍽️ Existing menus:', existingMenus.length);
          
          // Filter out empty menu items
          const validMenus = menus.filter(menuData => 
            menuData.namaMenu && menuData.namaMenu.trim() !== '' && 
            menuData.harga && !isNaN(parseFloat(menuData.harga.toString()))
          );
          console.log('🍽️ Valid menus to process:', validMenus.length);
          
          // Process each valid menu from the form
          const processedMenuIds: number[] = [];
          
          for (let i = 0; i < validMenus.length; i++) {
            const menuData = validMenus[i];
            console.log(`🍽️ Processing menu ${i + 1}:`, menuData);
            
            if (i < existingMenus.length) {
              // Update existing menu
              const existingMenu = existingMenus[i];
              await restaurantService.updateMenu(existingMenu.id, {
                namaMenu: menuData.namaMenu,
                harga: parseFloat(menuData.harga.toString())
              });
              processedMenuIds.push(existingMenu.id);
              console.log(`✅ Updated existing menu ${existingMenu.id}: ${menuData.namaMenu}`);
            } else {
              // Create new menu
              const newMenu = await restaurantService.createMenu({
                namaMenu: menuData.namaMenu,
                harga: parseFloat(menuData.harga.toString()),
                restaurantId: id
              });
              processedMenuIds.push(newMenu.id);
              console.log(`✅ Created new menu ${newMenu.id}: ${menuData.namaMenu}`);
            }
          }
          
          // Delete any extra existing menus that are no longer needed
          for (let i = validMenus.length; i < existingMenus.length; i++) {
            await restaurantService.deleteMenu(existingMenus[i].id);
            console.log(`🗑️ Deleted extra menu ${existingMenus[i].id}`);
          }
          
          console.log(`🎯 Menu processing complete. Processed ${processedMenuIds.length} menus.`);
        }
      } catch (menuError) {
        console.error('Error processing menus:', menuError);
        // Continue without failing the restaurant update
      }
    }
    
    // Update menu items with uploaded images
    if (Object.keys(menuImageUpdates).length > 0) {
      console.log('🍴 Updating menu items with images:', menuImageUpdates);
      
      // Get updated menus for this restaurant (after menu creation/update)
      const updatedMenus = await restaurantService.getMenusByRestaurantId(id);
      
      for (const [imageKey, filename] of Object.entries(menuImageUpdates)) {
        // Parse menu-{index}-{field} format
        const matches = imageKey.match(/menu-(\d+)-(\w+)/);
        if (matches) {
          const menuIndex = parseInt(matches[1]);
          const field = matches[2]; // fotoMakanan1 or fotoMakanan2
          
          // Find the corresponding menu (assuming menus are in order)
          if (updatedMenus && updatedMenus[menuIndex]) {
            const menuId = updatedMenus[menuIndex].id;
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
      message: "Restaurant berhasil diupdate",
      data: restaurant
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal mengupdate restaurant",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID restaurant tidak valid" },
        { status: 400 }
      );
    }

    const success = await restaurantService.deleteRestaurant(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Restaurant tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Restaurant berhasil dihapus"
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal menghapus restaurant",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}