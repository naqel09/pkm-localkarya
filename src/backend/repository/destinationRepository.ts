import { AppDataSource } from "../db/data-source";
import { Destination } from "../entities/Destination";

export const destinationRepository = AppDataSource.getRepository(Destination);
