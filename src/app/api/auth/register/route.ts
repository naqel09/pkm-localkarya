import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserService } from "@/backend/repository/userRepository";

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

        // Cek apakah username sudah ada
        const existingUser = await UserService.findByUsername(username);
        if (existingUser) {
            return NextResponse.json(
                { error: "Username sudah digunakan" },
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Buat user baru
        const newUser = await UserService.createUser(username, hashedPassword, role);
        if (!newUser) {
            return NextResponse.json(
                { error: "Gagal membuat user" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                message: "User berhasil dibuat",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    role: newUser.role
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
