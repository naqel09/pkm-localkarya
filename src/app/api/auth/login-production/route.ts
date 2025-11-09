import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Dynamic import untuk production
async function getUserService() {
    try {
        const { UserService } = await import("@/backend/repository/userRepository");
        return UserService;
    } catch (error) {
        console.warn("Database service not available, using fallback authentication");
        return null;
    }
}

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

        console.log(`🔐 [LOGIN] Attempting login for user: ${username}`);

        // Production: Gunakan database
        if (process.env.NODE_ENV === "production") {
            console.log(`🏭 [LOGIN] Production mode - using database authentication`);
            
            const UserService = await getUserService();
            if (!UserService) {
                return NextResponse.json(
                    { error: "Database service unavailable" },
                    { status: 500 }
                );
            }

            // Cari user di database
            const user = await UserService.findByUsername(username);
            if (!user) {
                console.log(`❌ [LOGIN] User not found: ${username}`);
                return NextResponse.json(
                    { error: "Username atau password salah" },
                    { status: 401 }
                );
            }

            // Verifikasi password dengan bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log(`❌ [LOGIN] Invalid password for user: ${username}`);
                return NextResponse.json(
                    { error: "Username atau password salah" },
                    { status: 401 }
                );
            }

            console.log(`✅ [LOGIN] Database authentication successful for user: ${username}`);

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    username: user.username, 
                    role: user.role || "admin" 
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
                        role: user.role || "admin" 
                    }
                },
                { status: 200 }
            );

            response.cookies.set("auth-token", token, {
                httpOnly: true,
                secure: true, // HTTPS only in production
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/",
            });

            return response;
        } 
        // Development: Hardcoded credentials
        else {
            console.log(`🔧 [LOGIN] Development mode - using hardcoded authentication`);
            
            if ((username === "admin" && password === "admin123") || 
                (username === "admin" && password === "password123")) {
                
                console.log(`✅ [LOGIN] Hardcoded authentication successful for user: ${username}`);
                
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
                    secure: true,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                });

                return response;
            } else {
                console.log(`❌ [LOGIN] Invalid hardcoded credentials for user: ${username}`);
                return NextResponse.json(
                    { error: "Username atau password salah" },
                    { status: 401 }
                );
            }
        }

    } catch (error) {
        console.error("❌ [LOGIN] Login error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
