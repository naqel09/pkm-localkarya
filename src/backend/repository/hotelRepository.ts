import { AppDataSource } from "../db/data-source";
import { Hotel } from "../entities/Hotel";

// Get repository dynamically to ensure AppDataSource is initialized
function getHotelRepository() {
    if (!AppDataSource.isInitialized) {
        throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(Hotel);
}

export const HotelRepository = {
    getRepository: getHotelRepository
};
