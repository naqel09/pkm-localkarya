// 'use client';

// import { useState } from 'react';

// // Tipe data untuk item menu
// interface MenuItem {
//   nama: string;
// }

// export default function RestaurantForm() {
//   // State untuk menyimpan data input restoran
//   const [restaurantData, setRestaurantData] = useState({
//     nama: '',
//     slug: '',
//     Deskripsi: '',
//     telefon: '',
//     kategory: '',
//     hari: '',
//     waktubuka: '08:00',
//     waktututup: '21:00',
//   });

//   // State untuk mengelola alur UI
//   const [isRestaurantSaved, setIsRestaurantSaved] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // State untuk menu
//   const [makananList, setMakananList] = useState<MenuItem[]>([]);
//   const [minumanList, setMinumanList] = useState<MenuItem[]>([]);
//   const [currentMakanan, setCurrentMakanan] = useState('');
//   const [currentMinuman, setCurrentMinuman] = useState('');

//   // Handler untuk mengubah data pada form restoran
//   const handleRestaurantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setRestaurantData(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handler saat tombol "Simpan Restaurant" ditekan
//   const handleSaveRestaurant = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Data Restoran Disimpan:', restaurantData);
//     alert('Restoran berhasil disimpan! Silakan tambahkan menu.');
//     setIsRestaurantSaved(true);
//   };
  
//   // Handler untuk menambah item makanan ke daftar
//   const handleAddMakanan = () => {
//     if (currentMakanan.trim() !== '') {
//       setMakananList([...makananList, { nama: currentMakanan.trim() }]);
//       setCurrentMakanan('');
//     }
//   };

//   // Handler untuk menambah item minuman ke daftar
//   const handleAddMinuman = () => {
//     if (currentMinuman.trim() !== '') {
//       setMinumanList([...minumanList, { nama: currentMinuman.trim() }]);
//       setCurrentMinuman('');
//     }
//   };

//   // Handler untuk menyimpan semua menu
//   const handleSaveMenu = async () => {
//       const menuData = {
//           makanan: makananList,
//           minuman: minumanList,
//       };
//       console.log('Menu yang akan disimpan:', menuData);
//       alert('Menu berhasil disimpan!');
//       setIsModalOpen(false);
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-12 px-4">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Formulir Restoran 🍽️</h1>
        
//         {/* BAGIAN 1: FORM INPUT RESTORAN */}
//         <form onSubmit={handleSaveRestaurant} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
//           <h2 className="text-2xl font-semibold text-gray-700">Data Restoran</h2>
//           <div>
//             <label htmlFor="nama" className="block text-sm font-medium text-gray-600 mb-1">Nama Restoran</label>
//             <input type="text" id="nama" name="nama" value={restaurantData.nama} onChange={handleRestaurantChange} required disabled={isRestaurantSaved}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
//           </div>
//           <div>
//             <label htmlFor="slug" className="block text-sm font-medium text-gray-600 mb-1">Slug URL</label>
//             <input type="text" id="slug" name="slug" value={restaurantData.slug} onChange={handleRestaurantChange} placeholder="contoh: ayam-bakar-nikmat" required disabled={isRestaurantSaved}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
//           </div>
//           <div>
//             <label htmlFor="Deskripsi" className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
//             <textarea id="Deskripsi" name="Deskripsi" value={restaurantData.Deskripsi} onChange={handleRestaurantChange} rows={3} required disabled={isRestaurantSaved}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"></textarea>
//           </div>
          
//           <button type="submit" disabled={isRestaurantSaved}
//             className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
//             {isRestaurantSaved ? '✔ Tersimpan' : 'Simpan Restaurant'}
//           </button>
//         </form>

//         {/* BAGIAN 2: TOMBOL TAMBAH MENU */}
//         {isRestaurantSaved && (
//           <div className="bg-white mt-8 p-8 rounded-xl shadow-lg text-center">
//             <h2 className="text-2xl font-semibold text-gray-700">Langkah Selanjutnya</h2>
//             <p className="text-gray-600 mt-2 mb-4">Data restoran sudah tersimpan. Sekarang, tambahkan menu untuk restoran Anda.</p>
//             <button onClick={() => setIsModalOpen(true)}
//               className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition duration-300">
//               + Tambah Menu
//             </button>
//           </div>
//         )}

//         {/* BAGIAN 3: POP-UP / MODAL UNTUK INPUT MENU */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
//             <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl relative">
//               <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold">&times;</button>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6">Input Menu Makanan & Minuman</h2>
              
//               <div className="grid md:grid-cols-2 gap-8">
//                 {/* KOLOM MAKANAN */}
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 pb-2">Makanan 🍔</h3>
//                   <div className="flex mb-4">
//                     <input type="text" placeholder="Nama makanan..." value={currentMakanan} onChange={(e) => setCurrentMakanan(e.target.value)}
//                       className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500" />
//                     <button onClick={handleAddMakanan}
//                       className="bg-green-500 text-white font-semibold px-4 rounded-r-md hover:bg-green-600">Tambah</button>
//                   </div>
//                   <ul className="space-y-2 h-40 overflow-y-auto pr-2">
//                     {makananList.map((item, index) => (
//                       <li key={index} className="bg-gray-100 p-2 rounded-md border-l-4 border-blue-500">{item.nama}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* KOLOM MINUMAN */}
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 pb-2">Minuman 🥤</h3>
//                   <div className="flex mb-4">
//                     <input type="text" placeholder="Nama minuman..." value={currentMinuman} onChange={(e) => setCurrentMinuman(e.target.value)}
//                       className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500" />
//                     <button onClick={handleAddMinuman}
//                       className="bg-green-500 text-white font-semibold px-4 rounded-r-md hover:bg-green-600">Tambah</button>
//                   </div>
//                   <ul className="space-y-2 h-40 overflow-y-auto pr-2">
//                     {minumanList.map((item, index) => (
//                       <li key={index} className="bg-gray-100 p-2 rounded-md border-l-4 border-yellow-500">{item.nama}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               <button onClick={handleSaveMenu} className="w-full mt-8 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300">Simpan Semua Menu</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }