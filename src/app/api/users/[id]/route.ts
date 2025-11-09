import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { User } from "@/backend/entities/User";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid user ID"
        },
        { status: 400 }
      );
    }

    // Get user by ID
    const user = await userRepository.findOne({
      where: { id },
      select: ["id", "username", "role", "created_at", "updated_at"]
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "User not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid user ID"
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await userRepository.findOne({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: "User not found"
        },
        { status: 404 }
      );
    }

    // Prevent modification of the main admin user
    if (existingUser.username === "admin") {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot modify the main admin user"
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, password, role } = body;

    // Update fields if provided
    if (username) {
      // Check if another user already has this username
      const userWithSameUsername = await userRepository.findOne({
        where: { username }
      });

      if (userWithSameUsername && userWithSameUsername.id !== id) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Username already taken by another user"
          },
          { status: 409 }
        );
      }

      existingUser.username = username;
    }

    if (password) {
      // Hash new password
      const saltRounds = 10;
      existingUser.password = await bcrypt.hash(password, saltRounds);
    }

    if (role) {
      existingUser.role = role;
    }

    const updatedUser = await userRepository.save(existingUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: userWithoutPassword
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid user ID"
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await userRepository.findOne({
      where: { id }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "User not found"
        },
        { status: 404 }
      );
    }

    // Prevent deletion of the main admin user
    if (user.username === "admin") {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot delete the main admin user"
        },
        { status: 403 }
      );
    }

    await userRepository.remove(user);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}