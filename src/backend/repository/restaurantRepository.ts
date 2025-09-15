import { AppDataSource } from "../db/data-source";
import { Restaurant } from "../entities/Restaurant";
import { Menu } from "../entities/Menu";

export class RestaurantRepository {
  private repository = AppDataSource.getRepository(Restaurant);
  private menuRepository = AppDataSource.getRepository(Menu);

  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.repository.find({
      order: { createdAt: 'DESC' }
    });
    
    // Manually fetch menus for each restaurant
    const restaurantsWithMenus = await Promise.all(
      restaurants.map(async (restaurant) => {
        const menus = await this.menuRepository.find({
          where: { restaurantId: restaurant.id }
        });
        return { ...restaurant, menus };
      })
    );
    
    return restaurantsWithMenus;
  }

  async findById(id: number): Promise<Restaurant | null> {
    const restaurant = await this.repository.findOne({
      where: { id }
    });
    
    if (!restaurant) return null;
    
    // Manually fetch menus
    const menus = await this.menuRepository.find({
      where: { restaurantId: id }
    });
    
    return { ...restaurant, menus } as any;
  }

  async create(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = this.repository.create(restaurantData);
    return await this.repository.save(restaurant);
  }

  async update(id: number, restaurantData: Partial<Restaurant>): Promise<Restaurant | null> {
    await this.repository.update(id, restaurantData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    // Delete associated menus first
    await this.menuRepository.delete({ restaurantId: id });
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  // Menu operations
  async createMenu(menuData: Partial<Menu>): Promise<Menu> {
    const menu = this.menuRepository.create(menuData);
    return await this.menuRepository.save(menu);
  }

  async updateMenu(menuId: number, menuData: Partial<Menu>): Promise<Menu | null> {
    await this.menuRepository.update(menuId, menuData);
    return await this.menuRepository.findOne({ where: { id: menuId } });
  }

  async deleteMenu(menuId: number): Promise<boolean> {
    const result = await this.menuRepository.delete(menuId);
    return result.affected !== 0;
  }

  async findMenusByRestaurantId(restaurantId: number): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: { restaurantId },
      order: { createdAt: 'DESC' }
    });
  }
}