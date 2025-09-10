import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("=== LOGIN DEBUG START ===");
        const startTime = Date.now();
        
        const { username, password } = await request.json();
        console.log(`1. Received data: username=${username}, password=***`);
        
        // Test 1: Validasi input
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username dan password harus diisi" },
                { status: 400 }
            );
        }
        console.log(`2. Input validation passed`);
        
        // Test 2: Import bcrypt (mungkin slow di sini)
        console.log(`3. Importing bcrypt...`);
        const bcryptImportStart = Date.now();
        const bcrypt = await import("bcryptjs");
        console.log(`4. bcrypt imported in ${Date.now() - bcryptImportStart}ms`);
        
        // Test 3: Import UserService
        console.log(`5. Importing UserService...`);
        const userServiceImportStart = Date.now();
        const { UserService } = await import("@/backend/repository/userRepository");
        console.log(`6. UserService imported in ${Date.now() - userServiceImportStart}ms`);
        
        // Test 4: Database query
        console.log(`7. Finding user in database...`);
        const dbQueryStart = Date.now();
        const user = await UserService.findByUsername(username);
        console.log(`8. Database query completed in ${Date.now() - dbQueryStart}ms`);
        
        if (!user) {
            console.log(`9. User not found`);
            return NextResponse.json(
                { error: "Username atau password salah" },
                { status: 401 }
            );
        }
        console.log(`9. User found: ${user.username}`);
        
        // Test 5: Password comparison (mungkin slow di sini)
        console.log(`10. Comparing password with bcrypt...`);
        const bcryptStart = Date.now();
        const isPasswordValid = await bcrypt.default.compare(password, user.password);
        console.log(`11. bcrypt compare completed in ${Date.now() - bcryptStart}ms`);
        
        if (!isPasswordValid) {
            console.log(`12. Password invalid`);
            return NextResponse.json(
                { error: "Username atau password salah" },
                { status: 401 }
            );
        }
        console.log(`12. Password valid`);
        
        const totalTime = Date.now() - startTime;
        console.log(`=== LOGIN DEBUG END: Total time ${totalTime}ms ===`);
        
        return NextResponse.json({ 
            message: "Login berhasil (debug mode)",
            user: { id: user.id, username: user.username, role: user.role },
            timing: totalTime
        });
        
    } catch (error) {
        console.error("Login debug error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat login debug", details: String(error) },
            { status: 500 }
        );
    }
}
