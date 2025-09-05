// "use client";

// import React, {useEffect, useState} from "react";
// import {useParams, useRouter} from "next/navigation";

// export default function EditRestaurantPage() {
//     const {id} = useParams(); // ambil id dari URL
//     const router = useRouter();

//     const [loading, setLoading] = useState(true);
//     const [restaurant, setRestaurant] = useState<any>(null);

//     const [makanan, setMakanan] = useState<string[]>([]);
//     const [minuman, setMinuman] = useState<string[]>([]);
//     const [menuInput, setMenuInput] = useState({makanan: "", minuman: ""});

//     const [showModal, setShowModal] = useState(false);

//     // 🔹 GET data restaurant
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await fetch(`/api/restaurant/${id}`);
//                 const data = await res.json();
//                 if (res.ok) {
//                     setRestaurant(data);
//                     // isi makanan & minuman dari relasi menu
//                     setMakanan(
//                         data.menu?.items
//                             ?.filter((i: any) => i.tipe === "makanan")
//                             .map((i: any) => i.nama) || []
//                     );
//                     setMinuman(
//                         data.menu?.items
//                             ?.filter((i: any) => i.tipe === "minuman")
//                             .map((i: any) => i.nama) || []
//                     );
//                 }
//             } catch (err) {
//                 console.error("Gagal fetch:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [id]);

//     // 🔹 PUT update restaurant
//     const handleUpdateRestaurant = async () => {
//         try {
//             const res = await fetch(`/api/restaurant/${id}`, {
//                 method: "PUT",
//                 headers: {"Content-Type": "application/json"},
//                 body: JSON.stringify({
//                     ...restaurant,
//                     menu: {
//                         makanan: makanan.map((nama) => ({nama})),
//                         minuman: minuman.map((nama) => ({nama})),
//                     },
//                 }),
//             });
//             const data = await res.json();
//             if (res.ok) {
//                 alert("Restaurant berhasil diupdate!");
//                 router.push("/restaurant"); // balik ke list misalnya
//             } else {
//                 alert("Gagal update: " + data.error);
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     if (loading) return <p className="p-6">Loading...</p>;
//     if (!restaurant) return <p className="p-6">Restaurant tidak ditemukan</p>;

//     return (
//         <div className="max-w-2xl mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-4">Edit Restaurant</h1>

//             {/* form restaurant */}
//             <div className="grid gap-3">
//                 <input
//                     className="border rounded p-2"
//                     placeholder="Nama Restaurant"
//                     value={restaurant.nama}
//                     onChange={(e) =>
//                         setRestaurant({...restaurant, nama: e.target.value})
//                     }
//                 />
//                 <input
//                     className="border rounded p-2"
//                     placeholder="Slug"
//                     value={restaurant.slug}
//                     onChange={(e) =>
//                         setRestaurant({...restaurant, slug: e.target.value})
//                     }
//                 />
//                 <textarea
//                     className="border rounded p-2"
//                     placeholder="Deskripsi"
//                     value={restaurant.deskripsi}
//                     onChange={(e) =>
//                         setRestaurant({
//                             ...restaurant,
//                             deskripsi: e.target.value,
//                         })
//                     }
//                 />
//                 <input
//                     className="border rounded p-2"
//                     placeholder="No. Telepon"
//                     value={restaurant.telefon}
//                     onChange={(e) =>
//                         setRestaurant({...restaurant, telefon: e.target.value})
//                     }
//                 />
//                 <input
//                     className="border rounded p-2"
//                     placeholder="Kategori"
//                     value={restaurant.kategory}
//                     onChange={(e) =>
//                         setRestaurant({...restaurant, kategory: e.target.value})
//                     }
//                 />
//                 <input
//                     className="border rounded p-2"
//                     placeholder="Hari buka"
//                     value={restaurant.hari}
//                     onChange={(e) =>
//                         setRestaurant({...restaurant, hari: e.target.value})
//                     }
//                 />
//                 <div className="grid grid-cols-2 gap-2">
//                     <input
//                         type="time"
//                         className="border rounded p-2"
//                         value={restaurant.waktubuka}
//                         onChange={(e) =>
//                             setRestaurant({
//                                 ...restaurant,
//                                 waktubuka: e.target.value,
//                             })
//                         }
//                     />
//                     <input
//                         type="time"
//                         className="border rounded p-2"
//                         value={restaurant.waktututup}
//                         onChange={(e) =>
//                             setRestaurant({
//                                 ...restaurant,
//                                 waktututup: e.target.value,
//                             })
//                         }
//                     />
//                 </div>

//                 <button
//                     onClick={() => setShowModal(true)}
//                     className="bg-green-600 text-white px-4 py-2 rounded"
//                 >
//                     Edit Menu
//                 </button>

//                 <button
//                     onClick={handleUpdateRestaurant}
//                     className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                     Simpan Perubahan
//                 </button>
//             </div>

//             {/* Modal Edit Menu */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//                         <h2 className="text-lg font-bold mb-4">Edit Menu</h2>

//                         {/* Input makanan */}
//                         <div className="mb-4">
//                             <input
//                                 className="border rounded p-2 w-full"
//                                 placeholder="Tambah Makanan"
//                                 value={menuInput.makanan}
//                                 onChange={(e) =>
//                                     setMenuInput({
//                                         ...menuInput,
//                                         makanan: e.target.value,
//                                     })
//                                 }
//                             />
//                             <button
//                                 className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
//                                 onClick={() => {
//                                     if (menuInput.makanan) {
//                                         setMakanan([
//                                             ...makanan,
//                                             menuInput.makanan,
//                                         ]);
//                                         setMenuInput({
//                                             ...menuInput,
//                                             makanan: "",
//                                         });
//                                     }
//                                 }}
//                             >
//                                 + Tambah Makanan
//                             </button>
//                             <ul className="list-disc ml-5 mt-2">
//                                 {makanan.map((m, i) => (
//                                     <li key={i}>{m}</li>
//                                 ))}
//                             </ul>
//                         </div>

//                         {/* Input minuman */}
//                         <div className="mb-4">
//                             <input
//                                 className="border rounded p-2 w-full"
//                                 placeholder="Tambah Minuman"
//                                 value={menuInput.minuman}
//                                 onChange={(e) =>
//                                     setMenuInput({
//                                         ...menuInput,
//                                         minuman: e.target.value,
//                                     })
//                                 }
//                             />
//                             <button
//                                 className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
//                                 onClick={() => {
//                                     if (menuInput.minuman) {
//                                         setMinuman([
//                                             ...minuman,
//                                             menuInput.minuman,
//                                         ]);
//                                         setMenuInput({
//                                             ...menuInput,
//                                             minuman: "",
//                                         });
//                                     }
//                                 }}
//                             >
//                                 + Tambah Minuman
//                             </button>
//                             <ul className="list-disc ml-5 mt-2">
//                                 {minuman.map((m, i) => (
//                                     <li key={i}>{m}</li>
//                                 ))}
//                             </ul>
//                         </div>

//                         <div className="flex justify-end gap-2">
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="bg-gray-400 text-white px-4 py-2 rounded"
//                             >
//                                 Tutup
//                             </button>
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="bg-green-600 text-white px-4 py-2 rounded"
//                             >
//                                 Selesai
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
