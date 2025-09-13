import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";

export async function GET() {
    try {
        console.log("=== DEBUG START ===");
        
        // Test database connection langsung
        if (!AppDataSource.isInitialized) {
            console.log("Initializing database...");
            await AppDataSource.initialize();
            console.log("Database initialized");
        }
        
        // Test query langsung
        console.log("Testing direct query...");
        const result = await AppDataSource.query("SELECT username, role FROM users WHERE username = 'admin'");
        console.log("Query result:", result);
        
        return NextResponse.json({
            success: true,
            dbInitialized: AppDataSource.isInitialized,
            userFound: result.length > 0,
            user: result[0] || null
        });
    } catch (error) {
        console.error("=== DEBUG ERROR ===", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
