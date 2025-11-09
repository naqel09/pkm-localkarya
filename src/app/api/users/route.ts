import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { User } from "@/backend/entities/User";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    
    // Get all users except the password field
    const users = await userRepository.find({
      select: ["id", "username", "role", "created_at", "updated_at"]
    });

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch users",
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

    const userRepository = AppDataSource.getRepository(User);
    
    const body = await request.json();
    const { username, password, role } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Username and password are required"
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: "User with this username already exists"
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = userRepository.create({
      username,
      password: hashedPassword,
      role: role || "admin"
    });

    const savedUser = await userRepository.save(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser;

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: userWithoutPassword
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}