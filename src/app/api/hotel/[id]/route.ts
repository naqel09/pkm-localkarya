import { NextResponse } from "next/server";
import { AppDataSource } from "@/backend/db/data-source";
import { Hotel } from "@/backend/entities/Hotel";
import { Room } from "@/backend/entities/Room";

export async function GET(request:Request,{params}:{params:{id:string}}){
    try{
        const hotelRepo = AppDataSource.getRepository(Hotel)
        const hotel = await hotelRepo.findOneBy({id:Number(params.id)});

        if(!hotel){
            return NextResponse.json({message:"hotel tidak ditemukan",status:404});
        }
        return NextResponse.json(hotel,{status:200})
    }catch(error){
        console.error("error fetching hotel",error);
        return NextResponse.json({message:"Internal Server Error"},{status:500})
    }
}

export async function PUT(request:Request,{params}:{params:{id:string}}){
    try{
        const id =parseInt(params.id);
        if(isNaN(id)){
            return NextResponse.json({message:"Invalid ID format"},{status:400})
        }
        const body = await request.json();
        const repo = AppDataSource.getRepository(Hotel);

        const hotelUpdate = await repo.findOne({
            where:{id},
            relations:['rooms']
        })
        if(!hotelUpdate){
            return NextResponse.json({message:"Hotel not Found"},{status:500})
        }
        if(body.rooms){
            const roomRepo =AppDataSource.getRepository(Room);
            const updatedRooms = body.rooms.map((roomData:Partial<Room>)=>{
                const room = new Room();
                Object.assign(room,roomData);
                return room;
            });
            hotelUpdate.rooms = updatedRooms;
        }

        repo.merge(hotelUpdate,body);
        const updated = await repo.save(hotelUpdate)
        return NextResponse.json(updated,{status:200})
    }catch(error){
        console.error("error updating Hotel:",error);
        return NextResponse.json({message:"Internal Server Error"},{status:500})
    }
}

// // GET /api/hotel/[id]
// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const hotelRepo = AppDataSource.getRepository(Hotel);
//     const hotel = await hotelRepo.findOne({
//       where: { id: parseInt(params.id) },
//       relations: ["rooms"],
//     });

//     if (!hotel) {
//       return NextResponse.json({ error: "Hotel tidak ditemukan" }, { status: 404 });
//     }

//     return NextResponse.json(hotel, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // PUT /api/hotel/[id]
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const hotelRepo = AppDataSource.getRepository(Hotel);
//     const roomRepo = AppDataSource.getRepository(Room);

//     const body = await request.json();
//     const hotel = await hotelRepo.findOne({
//       where: { id: parseInt(params.id) },
//       relations: ["rooms"],
//     });

//     if (!hotel) {
//       return NextResponse.json({ error: "Hotel tidak ditemukan" }, { status: 404 });
//     }

//     // Update field hotel
//     hotel.image = body.image ?? hotel.image;
//     hotel.slug = body.slug ?? hotel.slug;
//     hotel.title = body.title ?? hotel.title;
//     hotel.location = body.location ?? hotel.location;
//     hotel.price = body.price ?? hotel.price;
//     hotel.description = body.description ?? hotel.description;
//     hotel.galeri1 = body.galeri1 ?? hotel.galeri1;
//     hotel.galeri2 = body.galeri2 ?? hotel.galeri2;
//     hotel.galeri3 = body.galeri3 ?? hotel.galeri3;

//     // Update rooms jika ada di body
//     if (body.rooms) {
//       // hapus rooms lama
//       await roomRepo.delete({ hotel: { id: hotel.id } });

//       // tambahkan rooms baru
//       hotel.rooms = body.rooms.map((r: any) => {
//         const newRoom = new Room();
//         newRoom.name = r.name;
//         newRoom.description = r.description;
//         newRoom.image = r.image;
//         newRoom.price = r.price;
//         newRoom.galeri1 = r.galeri1;
//         newRoom.galeri2 = r.galeri2;
//         return newRoom;
//       });
//     }

//     const updatedHotel = await hotelRepo.save(hotel);

//     return NextResponse.json(updatedHotel, { status: 200 });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


export async function DELETE(request:Request,{params}:{params:{id:string}}){
    try{
        const hotelRepo=AppDataSource.getRepository(Hotel)
        const hotel= await hotelRepo.findOneBy({id:Number(params.id)});
        
        if(hotel){
            await hotelRepo.remove(hotel)
            return NextResponse.json({message:"data hotel berhasil dihapus",data:hotel},{status:200});
        }else{
            return NextResponse.json({message:"data artikel tidak ditemukan",status:404})
        }
    }catch(error){
        console.error("Error data artikel tidak terkoneksi ke database",error)
        return NextResponse.json({message:"server Error",status:500})
    }
}

// // DELETE /api/hotel/[id]
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const hotelRepo = AppDataSource.getRepository(Hotel);
//     const hotel = await hotelRepo.findOne({
//       where: { id: parseInt(params.id) },
//     });

//     if (!hotel) {
//       return NextResponse.json({ error: "Hotel tidak ditemukan" }, { status: 404 });
//     }

//     await hotelRepo.remove(hotel);

//     return NextResponse.json({ message: "Hotel berhasil dihapus" }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
