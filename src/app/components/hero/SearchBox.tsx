import React from "react";

function SearchBox() {
    return (
        <>
            {/* search box */}
            <div className="mt-10 bg-white shadow-md rounded-lg grid grid-cols-1 md:grid-cols-4 md:content-center gap-4 w-full max-w-3xl p-4">
                <input
                    type="text"
                    placeholder="Destinasi"
                    className="px-4 py-2 rounded border border-gray-300 shadow"
                />
                <input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="px-4 py-2 rounded w-full  text-black border border-gray-300 shadow cursor-pointer"
                />
                <input
                    type="text"
                    placeholder="Harga"
                    className="px-4 py-2 rounded  text-black border border-gray-300 shadow"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer shadow-md">
                    search
                </button>
            </div>
        </>
    );
}

export default SearchBox;
