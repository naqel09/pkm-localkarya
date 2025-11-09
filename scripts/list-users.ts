import { AppDataSource } from "@/backend/db/data-source";
import { User } from "@/backend/entities/User";

async function listUsers() {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    
    // Get all users
    const users = await userRepository.find();
    
    console.log("Users in database:");
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
    });
    
    console.log(`Total users: ${users.length}`);
  } catch (error) {
    console.error("Error listing users:", error);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run the function
listUsers();