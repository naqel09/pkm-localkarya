import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: "Logout berhasil" },
            { status: 200 }
        );

        // Hapus cookie auth-token
        response.cookies.set("auth-token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0
        });

        return response;

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
