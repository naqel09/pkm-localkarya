import { AppDataSource } from "../db/data-source";
import { Destination } from "../entities/Destination";

// Get repository dynamically to ensure AppDataSource is initialized
function getDestinationRepository() {
    if (!AppDataSource.isInitialized) {
        throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(Destination);
}

export const destinationRepository = {
    getRepository: getDestinationRepository
};
