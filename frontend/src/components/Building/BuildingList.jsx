import React from "react";

const BuildingList = ({ buildings, onSelect, onAddBuilding }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold"> All Buildings</h2>
        <button
          onClick={onAddBuilding}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Building
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {buildings.map((b) => (
          <div
            key={b._id}
            className="border rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer"
             onClick={() => onSelect(b)}
          >
            <h3 className="text-lg font-bold text-blue-700">{b.name}</h3>
            <p className="text-sm text-gray-600">{b.address}</p>
            <p className="text-sm">
              <strong>Floors:</strong> {b.totalFloors}
            </p>
            <p className="text-sm">
               Rooms: {b.rooms?.length || 0} | Shops: {b.shops?.length || 0}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onSelect(b)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg"
              >
                View
              </button>
              {/* <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-lg">
                Edit
              </button>
              <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg">
                Delete
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BuildingList;
