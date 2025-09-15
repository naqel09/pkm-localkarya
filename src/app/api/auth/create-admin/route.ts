import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { AppDataSource } from "@/backend/db/data-source";

export async function POST(request: NextRequest) {
    try {
        const { username, password, role = "admin" } = await request.json();

        // Validasi input
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username dan password harus diisi" },
                { status: 400 }
            );
        }

        console.log(`🔧 [CREATE-ADMIN] Attempting to create admin user: ${username}`);

        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Cek apakah user sudah ada dengan query langsung
        const existingUsers = await AppDataSource.query(
            "SELECT username FROM users WHERE username = $1",
            [username]
        );
        
        if (existingUsers.length > 0) {
            console.log(`⚠️ [CREATE-ADMIN] User already exists: ${username}`);
            return NextResponse.json(
                { message: "Admin user already exists" },
                { status: 200 }
            );
        }

        // Hash password dengan crypto (lebih cepat dari bcrypt)
        const hashedPassword = crypto.createHash('sha256').update(password + 'localkarya-salt').digest('hex');
        console.log(`🔑 [CREATE-ADMIN] Password hashed for user: ${username}`);

        // Insert user baru dengan query langsung
        const insertResult = await AppDataSource.query(
            "INSERT INTO users (username, password, role, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, username, role",
            [username, hashedPassword, role]
        );

        if (insertResult.length > 0) {
            const newUser = insertResult[0];
            console.log(`✅ [CREATE-ADMIN] Admin user created successfully: ${username}`);
            return NextResponse.json(
                { 
                    message: "Admin user created successfully",
                    user: {
                        id: newUser.id,
                        username: newUser.username,
                        role: newUser.role
                    }
                },
                { status: 201 }
            );
        } else {
            console.log(`❌ [CREATE-ADMIN] Failed to create admin user: ${username}`);
            return NextResponse.json(
                { error: "Failed to create admin user" },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("❌ [CREATE-ADMIN] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
