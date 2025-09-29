import { AppDataSource } from "../db/data-source";
import { Artikel } from "../entities/Artikel";

// Get repository dynamically to ensure AppDataSource is initialized
function getArtikelRepository() {
    if (!AppDataSource.isInitialized) {
        throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(Artikel);
}

export const artikelRepositoryService = {
    async findAll(): Promise<Artikel[]> {
        const repository = getArtikelRepository();
        return await repository.find({
            order: { tanggalPembuatan: 'DESC' }
        });
    },

    async findById(id: number): Promise<Artikel | null> {
        const repository = getArtikelRepository();
        return await repository.findOne({
            where: { id }
        });
    },

    async create(artikelData: Partial<Artikel>): Promise<Artikel> {
        const repository = getArtikelRepository();
        const artikel = repository.create(artikelData);
        return await repository.save(artikel);
    },

    async update(id: number, artikelData: Partial<Artikel>): Promise<Artikel | null> {
        const repository = getArtikelRepository();
        await repository.update(id, artikelData);
        return await this.findById(id);
    },

    async delete(id: number): Promise<boolean> {
        const repository = getArtikelRepository();
        const result = await repository.delete(id);
        return result.affected !== 0;
    },

    async findPaginated(page: number = 1, limit: number = 10): Promise<{articles: Artikel[], total: number}> {
        const repository = getArtikelRepository();
        const [articles, total] = await repository.findAndCount({
            order: { tanggalPembuatan: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { articles, total };
    }
};