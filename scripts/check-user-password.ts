import { AppDataSource } from "@/backend/db/data-source";
import { User } from "@/backend/entities/User";

async function checkUserPassword() {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    
    // Find the user
    const user = await userRepository.findOne({
      where: { username: "esa.fauzi" }
    });
    
    if (user) {
      console.log("User found:");
      console.log(`Username: ${user.username}`);
      console.log(`Password hash: ${user.password}`);
      console.log(`Password hash length: ${user.password.length}`);
      
      // Check if it looks like a bcrypt hash (bcrypt hashes start with $2)
      if (user.password.startsWith('$2')) {
        console.log("Password appears to be bcrypt hashed");
      } else {
        console.log("Password appears to be crypto hashed");
      }
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error checking user password:", error);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run the function
checkUserPassword();