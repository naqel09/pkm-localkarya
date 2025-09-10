import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST() {
    try {
        console.log("=== RESET ADMIN PASSWORD START ===");
        
        // Hash password dengan rounds yang lebih rendah untuk development
        const newPassword = "admin123";
        const rounds = 4; // Lebih cepat untuk development
        
        console.log(`Hashing password with ${rounds} rounds...`);
        const hashStart = Date.now();
        const hashedPassword = await bcrypt.hash(newPassword, rounds);
        console.log(`Password hashed in ${Date.now() - hashStart}ms`);
        
        // Import UserService
        const { UserService } = await import("@/backend/repository/userRepository");
        
        // Cari user admin
        const admin = await UserService.findByUsername("admin");
        if (!admin) {
            return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
        }
        
        // Update password langsung di database
        const { AppDataSource, initializeDatabase } = await import("@/backend/db/data-source");
        await initializeDatabase();
        const userRepository = AppDataSource.getRepository(admin.constructor);
        
        await userRepository.update({ id: admin.id }, { password: hashedPassword });
        
        console.log("=== RESET ADMIN PASSWORD SUCCESS ===");
        
        return NextResponse.json({ 
            message: "Password admin berhasil direset",
            info: "Username: admin, Password: admin123",
            hashRounds: rounds,
            hash: hashedPassword.substring(0, 20) + "..."
        });
        
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Gagal reset password", details: String(error) },
            { status: 500 }
        );
    }
}
