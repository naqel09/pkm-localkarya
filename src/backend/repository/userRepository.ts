import { AppDataSource, initializeDatabase } from "@/backend/db/data-source";
import { User } from "@/backend/entities/User";

async function getUserRepository() {
    await initializeDatabase();
    return AppDataSource.getRepository(User);
}

export const UserService = {
    // Mencari user berdasarkan username
    async findByUsername(username: string): Promise<User | null> {
        try {
            const userRepository = await getUserRepository();
            const user = await userRepository.findOne({
                where: { username }
            });
            return user;
        } catch (error) {
            console.error("Error finding user by username:", error);
            return null;
        }
    },

    // Membuat user baru
    async createUser(username: string, password: string, role: string = "admin"): Promise<User | null> {
        try {
            const userRepository = await getUserRepository();
            const newUser = userRepository.create({
                username,
                password,
                role
            });
            const savedUser = await userRepository.save(newUser);
            return savedUser;
        } catch (error) {
            console.error("Error creating user:", error);
            return null;
        }
    },

    // Mendapatkan semua users
    async getAllUsers(): Promise<User[]> {
        try {
            const userRepository = await getUserRepository();
            const users = await userRepository.find({
                select: ["id", "username", "role", "created_at", "updated_at"]
            });
            return users;
        } catch (error) {
            console.error("Error getting all users:", error);
            return [];
        }
    }
};
