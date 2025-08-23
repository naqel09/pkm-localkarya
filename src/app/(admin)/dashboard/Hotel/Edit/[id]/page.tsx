"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export default function EditHotelPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Menggunakan state yang sama seperti di halaman input
  const [hotel, setHotel] = useState({
    image: null as File | null,
    imagePreview: null as string | null,
    slug: "",
    title: "",
    location: "",
    price: "",
    description: "",
    galeri1: null as File | null,
    galeri1Preview: null as string | null,
    galeri2: null as File | null,
    galeri2Preview: null as string | null,
    galeri3: null as File | null,
    galeri3Preview: null as string | null,
  });

  const [rooms, setRooms] = useState([
    {
      name: "",
      description: "",
      image: null as File | null,
      preview: null as string | null,
      price: "",
      galeri1: null as File | null,
      galeri1Preview: null as string | null,
      galeri2: null as File | null,
      galeri2Preview: null as string | null,
    },
  ]);

  useEffect(() => {
    async function fetchHotelData() {
      try {
        if (!id) return;
        setLoading(true);
        const res = await fetch(`/api/hotel/${id}`,{cache:"no-store"});
        const data = await res.json();

        // Mengatur state hotel dari data yang diambil
        const newHotelState = {
          image: null, // File image akan dihandle terpisah
          imagePreview: data.image, // Menggunakan URL gambar yang sudah ada
          slug: data.slug,
          title: data.title,
          location: data.location,
          price: data.price,
          description: data.description,
          galeri1: null,
          galeri1Preview: data.galeri1,
          galeri2: null,
          galeri2Preview: data.galeri2,
          galeri3: null,
          galeri3Preview: data.galeri3,
        };
        setHotel(newHotelState);

        // Mengatur state rooms dari data yang diambil
        const newRoomsState = data.rooms.map((room:any) => ({
          name: room.name,
          description: room.description,
          image: null,
          preview: room.image,
          price: room.price,
          galeri1: null,
          galeri1Preview: room.galeri1,
          galeri2: null,
          galeri2Preview: room.galeri2,
        }));
        setRooms(newRoomsState);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchHotelData();
  }, [id]);

  // Fungsi-fungsi handler yang sama dari file input Anda
  const handleHotelImageChange = (
    key: keyof typeof hotel,
    previewKey: keyof typeof hotel,
    file: File | null
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHotel((prev) => ({
          ...prev,
          [key]: file,
          [previewKey]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setHotel((prev) => ({
        ...prev,
        [key]: null,
        [previewKey]: null,
      }));
    }
  };

  const handleRoomChange = (
    index: number,
    key: string,
    value: any,
    previewKey?: string
  ) => {
    const updatedRooms = [...rooms];
    (updatedRooms[index] as any)[key] = value;

    if (previewKey) {
      if (value && typeof value !== 'string') {
        const reader = new FileReader();
        reader.onloadend = () => {
          (updatedRooms[index] as any)[previewKey] = reader.result as string;
          setRooms(updatedRooms);
        };
        reader.readAsDataURL(value);
      } else {
        (updatedRooms[index] as any)[previewKey] = value;
        setRooms(updatedRooms);
      }
    } else {
      setRooms(updatedRooms);
    }
  };
  
  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        name: "",
        description: "",
        image: null,
        preview: null,
        price: "",
        galeri1: null,
        galeri1Preview: null,
        galeri2: null,
        galeri2Preview: null,
      },
    ]);
  };

  const removeRoom = (index: number) => {
    const updatedRooms = [...rooms];
    updatedRooms.splice(index, 1);
    setRooms(updatedRooms);
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(hotel).forEach(([key, value]) => {
      // Hanya kirim file atau data non-preview
      if (value && !key.toLowerCase().includes("preview")) {
        formData.append(key, value);
      }
    });

    rooms.forEach((room, i) => {
      Object.entries(room).forEach(([key, value]) => {
        if (value && !key.toLowerCase().includes("preview")) {
          formData.append(`rooms[${i}][${key}]`, value);
        }
      });
    });

    try {
      const res = await fetch(`/api/hotel/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        alert("Hotel berhasil diupdate!");
        router.push("/Dashboard/Hotel");
      } else {
        alert("Gagal mengupdate hotel");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  // Tampilan formulir yang sama seperti di halaman input
  return (
    <div className="max-w-8xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Hotel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Gambar Hotel Utama */}
        <label htmlFor="hotelImage" className="block cursor-pointer">
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded-md overflow-hidden">
            {hotel.imagePreview ? (
              <Image
                src={hotel.imagePreview}
                alt="Hotel Preview"
                width={300}
                height={200}
                className="object-cover w-full h-full"
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-white" />
            )}
          </div>
        </label>
        <input
          id="hotelImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            handleHotelImageChange(
              "image",
              "imagePreview",
              e.target.files?.[0] || null
            )
          }
        />

        {/* Input Hotel Info */}
        <input
          type="text"
          placeholder="Slug"
          className="border p-2 w-full"
          value={hotel.slug}
          onChange={(e) => setHotel({ ...hotel, slug: e.target.value })}
        />
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={hotel.title}
          onChange={(e) => setHotel({ ...hotel, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 w-full"
          value={hotel.location}
          onChange={(e) => setHotel({ ...hotel, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          className="border p-2 w-full"
          value={hotel.price}
          onChange={(e) => setHotel({ ...hotel, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={hotel.description}
          onChange={(e) => setHotel({ ...hotel, description: e.target.value })}
        ></textarea>

        {/* Galeri Hotel */}
        <div className="flex gap-4">
          {["galeri1", "galeri2", "galeri3"].map((gal) => (
            <div key={gal}>
              <label htmlFor={gal} className="block cursor-pointer">
                <div className="w-28 h-28 bg-gray-300 flex items-center justify-center rounded-md overflow-hidden">
                  {(hotel as any)[`${gal}Preview`] ? (
                    <Image
                      src={(hotel as any)[`${gal}Preview`]}
                      alt={`${gal} preview`}
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-white" />
                  )}
                </div>
              </label>
              <input
                id={gal}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleHotelImageChange(
                    gal as keyof typeof hotel,
                    `${gal}Preview` as keyof typeof hotel,
                    e.target.files?.[0] || null
                  )
                }
              />
            </div>
          ))}
        </div>

        {/* Rooms */}
        {rooms.map((room, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <h2 className="text-xl font-semibold">Rooms #{index + 1}</h2>

            {/* Room Image */}
            <label
              htmlFor={`roomImage-${index}`}
              className="block my-3 cursor-pointer"
            >
              <div className="w-full h-48 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                {room.preview ? (
                  <Image
                    src={room.preview}
                    alt="Room Preview"
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-white" />
                )}
              </div>
            </label>
            <input
              id={`roomImage-${index}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleRoomChange(
                  index,
                  "image",
                  e.target.files?.[0] || null,
                  "preview"
                )
              }
            />

            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full mb-2"
              value={room.name}
              onChange={(e) => handleRoomChange(index, "name", e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={room.description}
              onChange={(e) => handleRoomChange(index, "description", e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Price"
              className="border p-2 w-full mb-2"
              value={room.price}
              onChange={(e) => handleRoomChange(index, "price", e.target.value)}
            />

            {/* Room Galeri */}
            <div className="flex gap-4">
              {["galeri1", "galeri2"].map((gal) => (
                <div key={gal}>
                  <label
                    htmlFor={`room-${index}-${gal}`}
                    className="block cursor-pointer"
                  >
                    <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md overflow-hidden">
                      {(room as any)[`${gal}Preview`] ? (
                        <Image
                          src={(room as any)[`${gal}Preview`]}
                          alt={`${gal} preview`}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </label>
                  <input
                    id={`room-${index}-${gal}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleRoomChange(
                        index,
                        gal,
                        e.target.files?.[0] || null,
                        `${gal}Preview`
                      )
                    }
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => removeRoom(index)}
              className="mt-4 inline-flex justify-center rounded-md bg-red-600 py-2 px-4 text-white hover:bg-red-700"
            >
              Remove Room
            </button>
          </div>
        ))}

        {/* Tambah Room */}
        <button
          type="button"
          onClick={addRoom}
          className="w-full inline-flex justify-center rounded-md border bg-white py-2 px-4 text-gray-700 hover:bg-gray-50"
        >
          + Tambah Room
        </button>

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-6 text-white hover:bg-indigo-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}