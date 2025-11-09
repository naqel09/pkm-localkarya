import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "@/backend/db/data-source";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Validasi input
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username dan password harus diisi" },
                { status: 400 }
            );
        }

        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Query langsung tanpa UserService untuk menghindari timeout
        const users = await AppDataSource.query(
            "SELECT id, username, password, role FROM users WHERE username = $1",
            [username]
        );

        // If user exists in database, verify password normally
        if (users.length > 0) {
            const user = users[0];

            // Verifikasi password dengan bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return NextResponse.json(
                    { error: "Username atau password salah" },
                    { status: 401 }
                );
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    username: user.username, 
                    role: user.role 
                },
                process.env.JWT_SECRET || "localkarya-secret-key",
                { expiresIn: "24h" }
            );

            // Set cookie
            const response = NextResponse.json(
                { 
                    message: "Login berhasil",
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                },
                { status: 200 }
            );

            // Set HTTP-only cookie untuk keamanan
            response.cookies.set("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 // 24 jam
            });

            return response;
        }
        
        // If user doesn't exist in database, check hardcoded credentials (for backward compatibility)
        if ((username === "admin" && password === "admin123") || 
            (username === "admin" && password === "password123")) {
            
            // Generate JWT token for default admin
            const token = jwt.sign(
                { 
                    userId: 1, 
                    username: "admin", 
                    role: "admin" 
                },
                process.env.JWT_SECRET || "localkarya-secret-key",
                { expiresIn: "24h" }
            );

            // Set cookie
            const response = NextResponse.json(
                { 
                    message: "Login berhasil",
                    user: { id: 1, username: "admin", role: "admin" }
                },
                { status: 200 }
            );

            // Set HTTP-only cookie untuk keamanan
            response.cookies.set("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 // 24 jam
            });

            return response;
        }

        // If no user found and credentials don't match hardcoded values
        return NextResponse.json(
            { error: "Username atau password salah" },
            { status: 401 }
        );

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}