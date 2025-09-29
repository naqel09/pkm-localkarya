import { AppDataSource } from "../db/data-source";
import { Restaurant } from "../entities/Restaurant";
import { Menu } from "../entities/Menu";

// Get repository dynamically to ensure AppDataSource is initialized
function getRestaurantRepository() {
    if (!AppDataSource.isInitialized) {
        throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(Restaurant);
}

function getMenuRepository() {
    if (!AppDataSource.isInitialized) {
        throw new Error('Database not initialized');
    }
    return AppDataSource.getRepository(Menu);
}

export class RestaurantRepository {
  async findAll(): Promise<Restaurant[]> {
    const repository = getRestaurantRepository();
    const menuRepository = getMenuRepository();
    
    const restaurants = await repository.find({
      order: { createdAt: 'DESC' }
    });
    
    // Manually fetch menus for each restaurant
    const restaurantsWithMenus = await Promise.all(
      restaurants.map(async (restaurant) => {
        const menus = await menuRepository.find({
          where: { restaurantId: restaurant.id }
        });
        return { ...restaurant, menus };
      })
    );
    
    return restaurantsWithMenus;
  }

  async findById(id: number): Promise<Restaurant | null> {
    const repository = getRestaurantRepository();
    const menuRepository = getMenuRepository();
    
    const restaurant = await repository.findOne({
      where: { id }
    });
    
    if (!restaurant) return null;
    
    // Manually fetch menus
    const menus = await menuRepository.find({
      where: { restaurantId: id }
    });
    
    return { ...restaurant, menus } as any;
  }

  async create(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    const repository = getRestaurantRepository();
    const restaurant = repository.create(restaurantData);
    return await repository.save(restaurant);
  }

  async update(id: number, restaurantData: Partial<Restaurant>): Promise<Restaurant | null> {
    const repository = getRestaurantRepository();
    await repository.update(id, restaurantData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const repository = getRestaurantRepository();
    const menuRepository = getMenuRepository();
    
    // Delete associated menus first
    await menuRepository.delete({ restaurantId: id });
    const result = await repository.delete(id);
    return result.affected !== 0;
  }

  // Menu operations
  async createMenu(menuData: Partial<Menu>): Promise<Menu> {
    const menuRepository = getMenuRepository();
    const menu = menuRepository.create(menuData);
    return await menuRepository.save(menu);
  }

  async updateMenu(menuId: number, menuData: Partial<Menu>): Promise<Menu | null> {
    const menuRepository = getMenuRepository();
    await menuRepository.update(menuId, menuData);
    return await menuRepository.findOne({ where: { id: menuId } });
  }

  async deleteMenu(menuId: number): Promise<boolean> {
    const menuRepository = getMenuRepository();
    const result = await menuRepository.delete(menuId);
    return result.affected !== 0;
  }

  async findMenusByRestaurantId(restaurantId: number): Promise<Menu[]> {
    const menuRepository = getMenuRepository();
    return await menuRepository.find({
      where: { restaurantId },
      order: { createdAt: 'DESC' }
    });
  }
}