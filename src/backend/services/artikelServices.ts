import { artikelRepositoryService } from "../repository/artikelRepository";
import { Artikel } from "../entities/Artikel";

export const artikelService = {
    async getAllArtikels(): Promise<Artikel[]> {
        try {
            return await artikelRepositoryService.findAll();
        } catch (error) {
            console.error('Error fetching all artikels:', error);
            throw new Error('Failed to fetch artikels');
        }
    },

    async getArtikelById(id: number): Promise<Artikel | null> {
        try {
            return await artikelRepositoryService.findById(id);
        } catch (error) {
            console.error(`Error fetching artikel with id ${id}:`, error);
            throw new Error('Failed to fetch artikel');
        }
    },

    async createArtikel(artikelData: {
        judul: string;
        gambar: string;
        isiArtikel: string;
        penulis: string;
    }): Promise<Artikel> {
        try {
            return await artikelRepositoryService.create(artikelData);
        } catch (error) {
            console.error('Error creating artikel:', error);
            throw new Error('Failed to create artikel');
        }
    },

    async updateArtikel(id: number, artikelData: Partial<{
        judul: string;
        gambar: string;
        isiArtikel: string;
        penulis: string;
    }>): Promise<Artikel | null> {
        try {
            return await artikelRepositoryService.update(id, artikelData);
        } catch (error) {
            console.error(`Error updating artikel with id ${id}:`, error);
            throw new Error('Failed to update artikel');
        }
    },

    async deleteArtikel(id: number): Promise<boolean> {
        try {
            return await artikelRepositoryService.delete(id);
        } catch (error) {
            console.error(`Error deleting artikel with id ${id}:`, error);
            throw new Error('Failed to delete artikel');
        }
    },

    async getArtikelsPaginated(page: number = 1, limit: number = 10): Promise<{articles: Artikel[], total: number, totalPages: number}> {
        try {
            const result = await artikelRepositoryService.findPaginated(page, limit);
            const totalPages = Math.ceil(result.total / limit);
            return {
                articles: result.articles,
                total: result.total,
                totalPages
            };
        } catch (error) {
            console.error('Error fetching paginated artikels:', error);
            throw new Error('Failed to fetch paginated artikels');
        }
    }
};