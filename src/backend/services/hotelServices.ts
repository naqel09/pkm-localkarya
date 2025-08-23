// src/backend/services/HotelService.ts
import { AppDataSource } from "@/backend/db/data-source";
import { Hotel } from "@/backend/entities/Hotel";
import { Room } from "@/backend/entities/Room";

export class HotelService {
  // CREATE - Tambah hotel baru
  static async createHotel(data: Partial<Hotel>) {
    await AppDataSource.initialize().catch(() => {});
    const hotelRepo = AppDataSource.getRepository(Hotel);
    const roomRepo = AppDataSource.getRepository(Room);

    const { rooms, ...hotelData } = data;
    const newHotel = hotelRepo.create(hotelData);

    if (rooms && rooms.length > 0) {
      newHotel.rooms = rooms.map((room) => roomRepo.create(room));
    }

    return await hotelRepo.save(newHotel);
  }

  // READ - Ambil semua hotel
  static async getAllHotels() {
    await AppDataSource.initialize().catch(() => {});
    const hotelRepo = AppDataSource.getRepository(Hotel);
    return await hotelRepo.find({ relations: ["rooms"] });
  }

  // READ - Ambil hotel by ID
  static async getHotelById(id: number) {
    await AppDataSource.initialize().catch(() => {});
    const hotelRepo = AppDataSource.getRepository(Hotel);
    return await hotelRepo.findOne({
      where: { id },
      relations: ["rooms"],
    });
  }

  // UPDATE - Update hotel + rooms
  static async updateHotel(id: number, data: Partial<Hotel>) {
    await AppDataSource.initialize().catch(() => {});
    const hotelRepo = AppDataSource.getRepository(Hotel);
    const roomRepo = AppDataSource.getRepository(Room);

    const hotel = await hotelRepo.findOne({
      where: { id },
      relations: ["rooms"],
    });

    if (!hotel) return null;

    const { rooms, ...hotelData } = data;

    // Update data hotel
    Object.assign(hotel, hotelData);

    if (rooms) {
      // 1. Update / tambah room
      const updatedRooms: Room[] = [];

      for (const roomData of rooms) {
        if (roomData.id) {
          // Room lama → update
          const existingRoom = hotel.rooms.find((r) => r.id === roomData.id);
          if (existingRoom) {
            Object.assign(existingRoom, roomData);
            updatedRooms.push(existingRoom);
          }
        } else {
          // Room baru → buat
          const newRoom = roomRepo.create(roomData);
          newRoom.hotel = hotel;
          updatedRooms.push(newRoom);
        }
      }

      // 2. Hapus room yang tidak ada di request
      const incomingRoomIds = rooms.filter((r) => r.id).map((r) => r.id);
      const roomsToRemove = hotel.rooms.filter(
        (r) => !incomingRoomIds.includes(r.id)
      );
      if (roomsToRemove.length > 0) {
        await roomRepo.remove(roomsToRemove);
      }

      hotel.rooms = updatedRooms;
    }

    return await hotelRepo.save(hotel);
  }

  // DELETE - Hapus hotel
  static async deleteHotel(id: number) {
    await AppDataSource.initialize().catch(() => {});
    const hotelRepo = AppDataSource.getRepository(Hotel);
    const hotel = await hotelRepo.findOne({ where: { id }, relations: ["rooms"] });

    if (!hotel) return false;

    await hotelRepo.remove(hotel);
    return true;
  }
}
