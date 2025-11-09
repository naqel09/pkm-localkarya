import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { User } from "@/backend/entities/User";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    
    // Find the admin user (could be 'esa.fauzi' or 'admin')
    let adminUser = await userRepository.findOne({
      where: { username: "esa.fauzi" }
    });
    
    // If not found, try 'admin'
    if (!adminUser) {
      adminUser = await userRepository.findOne({
        where: { username: "admin" }
      });
    }
    
    if (!adminUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Admin user not found"
        },
        { status: 404 }
      );
    }

    // Hash the new password "nyaba123"
    const saltRounds = 10;
    const newPassword = "nyaba123";
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the admin user's password
    adminUser.password = hashedPassword;
    await userRepository.save(adminUser);

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully to 'nyaba123'"
    });
  } catch (error) {
    console.error("Error updating admin password:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update admin password",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}