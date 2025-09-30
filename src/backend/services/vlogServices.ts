import { vlogRepositoryService } from "../repository/vlogRepository";
import { Vlog } from "../entities/Vlog";

export const vlogService = {
    async getAllVlogs(): Promise<Vlog[]> {
        try {
            return await vlogRepositoryService.findAll();
        } catch (error) {
            console.error('Error fetching all vlogs:', error);
            throw new Error('Failed to fetch vlogs');
        }
    },

    async getVlogById(id: number): Promise<Vlog | null> {
        try {
            return await vlogRepositoryService.findById(id);
        } catch (error) {
            console.error(`Error fetching vlog with id ${id}:`, error);
            throw new Error('Failed to fetch vlog');
        }
    },

    async getVlogsPaginated(page: number, limit: number): Promise<{
        vlogs: Vlog[];
        total: number;
        totalPages: number;
    }> {
        try {
            return await vlogRepositoryService.findPaginated(page, limit);
        } catch (error) {
            console.error('Error fetching paginated vlogs:', error);
            throw new Error('Failed to fetch paginated vlogs');
        }
    },

    async createVlog(vlogData: {
        judulVideo: string;
        deskripsiVideo: string;
        linkYoutube: string;
    }): Promise<Vlog> {
        try {
            return await vlogRepositoryService.create(vlogData);
        } catch (error) {
            console.error('Error creating vlog:', error);
            throw new Error('Failed to create vlog');
        }
    },

    async updateVlog(id: number, vlogData: Partial<{
        judulVideo: string;
        deskripsiVideo: string;
        linkYoutube: string;
    }>): Promise<Vlog | null> {
        try {
            return await vlogRepositoryService.update(id, vlogData);
        } catch (error) {
            console.error(`Error updating vlog with id ${id}:`, error);
            throw new Error('Failed to update vlog');
        }
    },

    async deleteVlog(id: number): Promise<boolean> {
        try {
            return await vlogRepositoryService.delete(id);
        } catch (error) {
            console.error(`Error deleting vlog with id ${id}:`, error);
            throw new Error('Failed to delete vlog');
        }
    }
};