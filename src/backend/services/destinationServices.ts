import { destinationRepository } from "../repository/destinationRepository";
import { Destination } from "../entities/Destination";

export const createDestination = async (data: Partial<Destination>) => {
    const destination = destinationRepository.create(data);
    return await destinationRepository.save(destination);
};


// Update
export const updateDestination = async (id: number, data: Partial<Destination>) => {
    const destination = await destinationRepository.findOneBy({ id });
    if (!destination) {
        throw new Error("Destination not found");
    }
    Object.assign(destination, data);
    return await destinationRepository.save(destination);
};

// Delete
export const deleteDestination = async (id: number) => {
    const destination = await destinationRepository.findOneBy({ id });
    if (!destination) {
        throw new Error("Destination not found");
    }
    await destinationRepository.remove(destination);
    return { message: "Destination deleted successfully" };
};
