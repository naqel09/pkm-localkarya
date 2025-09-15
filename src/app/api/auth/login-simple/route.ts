import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

        // Hardcoded login untuk development (bypass database)
        if ((username === "admin" && password === "admin123") || 
            (username === "admin" && password === "password123")) {
            
            console.log(`✅ [LOGIN API] Authentication successful for user: ${username}`);
            
            // Generate JWT token
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

            response.cookies.set("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/",
            });

            console.log(`🍪 [LOGIN API] Cookie set successfully for user: ${username}`);
            return response;
        } else {
            return NextResponse.json(
                { error: "Username atau password salah" },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error("Login simple error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat login" },
            { status: 500 }
        );
    }
}
