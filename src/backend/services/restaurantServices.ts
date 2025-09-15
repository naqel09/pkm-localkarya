import { initializeDatabase } from "../db/data-source";
import { RestaurantRepository } from "../repository/restaurantRepository";
import { Restaurant } from "../entities/Restaurant";
import { Menu } from "../entities/Menu";

export class RestaurantService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    await initializeDatabase();
    return await this.restaurantRepository.findAll();
  }

  async getRestaurantById(id: number): Promise<Restaurant | null> {
    await initializeDatabase();
    return await this.restaurantRepository.findById(id);
  }

  async createRestaurant(restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt' | 'menus'>): Promise<Restaurant> {
    await initializeDatabase();
    return await this.restaurantRepository.create(restaurantData);
  }

  async updateRestaurant(id: number, restaurantData: Partial<Restaurant>): Promise<Restaurant | null> {
    await initializeDatabase();
    return await this.restaurantRepository.update(id, restaurantData);
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    await initializeDatabase();
    return await this.restaurantRepository.delete(id);
  }

  // Menu services
  async createMenu(menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt' | 'restaurant'>): Promise<Menu> {
    await initializeDatabase();
    return await this.restaurantRepository.createMenu(menuData);
  }

  async updateMenu(menuId: number, menuData: Partial<Menu>): Promise<Menu | null> {
    await initializeDatabase();
    return await this.restaurantRepository.updateMenu(menuId, menuData);
  }

  async deleteMenu(menuId: number): Promise<boolean> {
    await initializeDatabase();
    return await this.restaurantRepository.deleteMenu(menuId);
  }

  async getMenusByRestaurantId(restaurantId: number): Promise<Menu[]> {
    await initializeDatabase();
    return await this.restaurantRepository.findMenusByRestaurantId(restaurantId);
  }

  // Validation helpers
  validateRestaurantData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.namaRestaurant || data.namaRestaurant.trim() === '') {
      errors.push('Nama restaurant harus diisi');
    }

    if (!data.alamatRestaurant || data.alamatRestaurant.trim() === '') {
      errors.push('Alamat restaurant harus diisi');
    }

    if (!data.deskripsiRestaurant || data.deskripsiRestaurant.trim() === '') {
      errors.push('Deskripsi restaurant harus diisi');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateMenuData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.namaMenu || data.namaMenu.trim() === '') {
      errors.push('Nama menu harus diisi');
    }

    if (!data.harga || isNaN(data.harga) || Number(data.harga) <= 0) {
      errors.push('Harga menu harus berupa angka yang valid dan lebih besar dari 0');
    }

    if (!data.restaurantId || isNaN(data.restaurantId)) {
      errors.push('Restaurant ID harus valid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}