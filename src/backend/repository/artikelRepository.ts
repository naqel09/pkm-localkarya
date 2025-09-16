import { AppDataSource } from "../db/data-source";
import { Artikel } from "../entities/Artikel";

export const artikelRepository = AppDataSource.getRepository(Artikel);

export const artikelRepositoryService = {
    async findAll(): Promise<Artikel[]> {
        return await artikelRepository.find({
            order: { tanggalPembuatan: 'DESC' }
        });
    },

    async findById(id: number): Promise<Artikel | null> {
        return await artikelRepository.findOne({
            where: { id }
        });
    },

    async create(artikelData: Partial<Artikel>): Promise<Artikel> {
        const artikel = artikelRepository.create(artikelData);
        return await artikelRepository.save(artikel);
    },

    async update(id: number, artikelData: Partial<Artikel>): Promise<Artikel | null> {
        await artikelRepository.update(id, artikelData);
        return await this.findById(id);
    },

    async delete(id: number): Promise<boolean> {
        const result = await artikelRepository.delete(id);
        return result.affected !== 0;
    },

    async findPaginated(page: number = 1, limit: number = 10): Promise<{articles: Artikel[], total: number}> {
        const [articles, total] = await artikelRepository.findAndCount({
            order: { tanggalPembuatan: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { articles, total };
    }
};