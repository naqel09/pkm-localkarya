import { AppDataSource } from "../db/data-source";
import { Vlog } from "../entities/Vlog";

// Get repository dynamically to ensure AppDataSource is initialized
function getVlogRepository() {
    if (!AppDataSource.isInitialized) {
        throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(Vlog);
}

export const vlogRepositoryService = {
    async findAll(): Promise<Vlog[]> {
        const repository = getVlogRepository();
        return await repository.find({
            order: { createdAt: 'DESC' }
        });
    },

    async findById(id: number): Promise<Vlog | null> {
        const repository = getVlogRepository();
        return await repository.findOne({
            where: { id }
        });
    },

    async create(vlogData: Partial<Vlog>): Promise<Vlog> {
        const repository = getVlogRepository();
        const vlog = repository.create(vlogData);
        return await repository.save(vlog);
    },

    async update(id: number, vlogData: Partial<Vlog>): Promise<Vlog | null> {
        const repository = getVlogRepository();
        await repository.update(id, vlogData);
        return await this.findById(id);
    },

    async delete(id: number): Promise<boolean> {
        const repository = getVlogRepository();
        const result = await repository.delete(id);
        return result.affected !== 0;
    },

    async findPaginated(page: number = 1, limit: number = 10): Promise<{
        vlogs: Vlog[], 
        total: number,
        totalPages: number
    }> {
        const repository = getVlogRepository();
        const [vlogs, total] = await repository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });

        return {
            vlogs,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }
};