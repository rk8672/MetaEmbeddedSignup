import React from "react";

const BuildingDetails = ({ building, loading, setSelectedBuilding, onAddRoom, onAddShop }) => {
  if (!building) return null; // safety check

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => setSelectedBuilding(null)}
        className="mb-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
      >
        ← Back
      </button>

      {/* Building info */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-blue-700">{building.name}</h2>
        <p className="text-gray-600">{building.address}</p>
        <p className="mt-2 text-sm text-gray-500">
          <strong>Floors:</strong> {building.totalFloors || 0}
        </p>
        <p className="text-sm mt-2 text-gray-500">
          Rooms: {building.rooms?.length || 0} | Shops: {building.shops?.length || 0}
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onAddRoom}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Add Room
          </button>
          <button
            onClick={onAddShop}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Add Shop
          </button>
        </div>
      </div>

      {/* Room Cards */}
      {loading ? (
        <div className="mt-6 text-center text-gray-500">Loading details...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {building.rooms?.length ? (
            building.rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    Room {room.roomNumber}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      room.isOccupied
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {room.isOccupied ? "Occupied" : "Available"}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 flex  text-sm text-gray-600 gap-3">
                  <p>
                    <strong>Floor Number :</strong> {room.floor}
                  </p>
                 
                  <p>
                    <strong>Capacity :</strong> {room.capacity}
                  </p>
                 
                
               
                </div>

           

                {/* Tenants */}
               <div className="mt-4">
  <h4 className="text-sm font-semibold text-gray-700">Guests:</h4>
  {room.tenants?.length ? (
    <ul className="list-disc list-inside text-sm text-gray-600">
      {room.tenants.map((tenant, i) => (
        <li key={tenant._id || i}>{tenant.name}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-400 text-sm">No Guests</p>
  )}
</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No rooms added yet
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildingDetails;
