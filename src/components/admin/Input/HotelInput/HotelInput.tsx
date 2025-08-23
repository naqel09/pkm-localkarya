// src/components/RoomInput.tsx
"use client";

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

interface RoomInputProps {
  control: any;
  index: number;
  onRemove: () => void;
}

export const HotelInput: React.FC<RoomInputProps> = ({ control, index, onRemove }) => {
  return (
    <div className="border border-gray-300 p-4 rounded-md mb-4 bg-gray-50">
      <h4 className="text-lg font-semibold mb-2">Room #{index + 1}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Name</label>
          <input
            {...control.register(`rooms.${index}.name`)}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            {...control.register(`rooms.${index}.price`)}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            {...control.register(`rooms.${index}.image`)}
            type="file"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gallery URLs (comma separated)</label>
          <input
            {...control.register(`rooms.${index}.galeri`)}
            type="file"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...control.register(`rooms.${index}.description`)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Remove Room
      </button>
    </div>
  );
};