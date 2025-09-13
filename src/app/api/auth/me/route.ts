import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getAuthUser();
        
        if (!user) {
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { 
                authenticated: true, 
                user: {
                    id: user.userId,
                    username: user.username,
                    role: user.role
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
