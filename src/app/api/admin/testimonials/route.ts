import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Testimonial } from "@/backend/entities/Testimonial";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const testimonialRepository = AppDataSource.getRepository(Testimonial);
    
    // Get all testimonials ordered by orderIndex
    const testimonials = await testimonialRepository.find({
      order: {
        orderIndex: "ASC"
      }
    });

    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch testimonials",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const testimonialRepository = AppDataSource.getRepository(Testimonial);
    
    const formData = await request.formData();
    
    // Get form data
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const comment = formData.get("comment") as string;
    const orderIndex = parseInt(formData.get("orderIndex") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    const image = formData.get("image") as File | null;

    // Create new testimonial
    const testimonial = testimonialRepository.create({
      name,
      location,
      comment,
      imageUrl: "/testimonials.jpg", // Default image
      orderIndex,
      isActive
    });

    // Handle image upload if provided
    if (image && image.size > 0) {
      const fileName = `${Date.now()}-${image.name}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save image to public/uploads directory
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Create upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      
      testimonial.imageUrl = `/uploads/${fileName}`;
    }

    const savedTestimonial = await testimonialRepository.save(testimonial);

    return NextResponse.json({
      success: true,
      message: "Testimonial created successfully",
      data: savedTestimonial
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create testimonial",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const testimonialRepository = AppDataSource.getRepository(Testimonial);
    
    const formData = await request.formData();
    
    // Get form data
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const comment = formData.get("comment") as string;
    const orderIndex = parseInt(formData.get("orderIndex") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    const image = formData.get("image") as File | null;

    // Find existing testimonial
    const testimonial = await testimonialRepository.findOne({
      where: { id }
    });

    if (!testimonial) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Testimonial not found"
        },
        { status: 404 }
      );
    }

    // Update fields
    testimonial.name = name;
    testimonial.location = location;
    testimonial.comment = comment;
    testimonial.orderIndex = orderIndex;
    testimonial.isActive = isActive;

    // Handle image upload if provided
    if (image && image.size > 0) {
      // Delete old image if it's an uploaded file (not a static asset)
      if (testimonial.imageUrl && testimonial.imageUrl.startsWith('/uploads/')) {
        const oldFilePath = path.join(process.cwd(), "public", testimonial.imageUrl.replace('/uploads/', ''));
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      const fileName = `${Date.now()}-${image.name}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save image to public/uploads directory
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Create upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      
      testimonial.imageUrl = `/uploads/${fileName}`;
    }

    const updatedTestimonial = await testimonialRepository.save(testimonial);

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update testimonial",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const testimonialRepository = AppDataSource.getRepository(Testimonial);
    
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "");
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Testimonial ID is required"
        },
        { status: 400 }
      );
    }

    // Find existing testimonial
    const testimonial = await testimonialRepository.findOne({
      where: { id }
    });

    if (!testimonial) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Testimonial not found"
        },
        { status: 404 }
      );
    }

    // Delete image if it's an uploaded file (not a static asset)
    if (testimonial.imageUrl && testimonial.imageUrl.startsWith('/uploads/')) {
      const oldFilePath = path.join(process.cwd(), "public", testimonial.imageUrl.replace('/uploads/', ''));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await testimonialRepository.remove(testimonial);

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete testimonial",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}