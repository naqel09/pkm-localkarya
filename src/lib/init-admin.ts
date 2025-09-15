import crypto from "crypto";

export async function initializeAdmin() {
    try {
        // Import UserService di dalam fungsi untuk menghindari circular dependency
        const { UserService } = await import("@/backend/repository/userRepository");
        
        // Cek apakah sudah ada user admin
        const existingAdmin = await UserService.findByUsername("admin");
        
        if (!existingAdmin) {
            // Hash password default dengan crypto untuk performa
            const defaultPassword = "admin123";
            console.log("Hashing admin password with crypto...");
            const hashedPassword = crypto.createHash('sha256').update(defaultPassword + 'localkarya-salt').digest('hex');
            
            // Buat user admin default
            const adminUser = await UserService.createUser("admin", hashedPassword, "admin");
            
            if (adminUser) {
                console.log("✅ User admin default berhasil dibuat");
                console.log("Username: admin");
                console.log("Password: admin123");
                console.log("⚠️  Silakan ganti password default setelah login");
            } else {
                console.log("❌ Gagal membuat user admin default");
            }
        } else {
            console.log("ℹ️  User admin sudah ada");
        }
    } catch (error) {
        console.error("Error initializing admin:", error);
    }
}
