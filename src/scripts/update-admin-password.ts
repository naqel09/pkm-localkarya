import { AppDataSource } from "@/backend/db/data-source";
import { User } from "@/backend/entities/User";
import bcrypt from "bcryptjs";

async function updateAdminPassword() {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    
    // Find the admin user
    const adminUser = await userRepository.findOne({
      where: { username: "admin" }
    });

    if (!adminUser) {
      console.log("Admin user not found");
      return;
    }

    // Hash the new password "nyaba123"
    const saltRounds = 10;
    const newPassword = "nyaba123";
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the admin user's password
    adminUser.password = hashedPassword;
    await userRepository.save(adminUser);

    console.log("Admin password updated successfully to 'nyaba123'");
  } catch (error) {
    console.error("Error updating admin password:", error);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run the function
updateAdminPassword();