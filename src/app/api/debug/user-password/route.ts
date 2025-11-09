import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Query the user directly
    const users = await AppDataSource.query(
      "SELECT id, username, password, role FROM users WHERE username = $1",
      ["esa.fauzi"]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    
    // Test both bcrypt and crypto verification
    const bcryptValid = await bcrypt.compare("admin123", user.password);
    
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      passwordInfo: {
        hash: user.password,
        bcryptValid: bcryptValid,
        hashType: user.password.startsWith('$2') ? 'bcrypt' : 'crypto'
      }
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}