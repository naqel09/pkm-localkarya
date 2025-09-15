import { NextResponse } from "next/server";
import { UserService } from "@/backend/repository/userRepository";

export async function GET() {
    try {
        console.log("Testing database connection...");
        const user = await UserService.findByUsername('admin');
        console.log("User found:", user ? 'Yes' : 'No');
        
        return NextResponse.json({
            success: true,
            userExists: !!user,
            username: user?.username,
            role: user?.role
        });
    } catch (error) {
        console.error("Database test error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
