import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import PageWrapper from "../../layouts/PageWrapper";
import BuildingList from "../Building/BuildingList";
import BuildingDetails from "../Building/BuildingDetails";
import AddBuildingModal from "../modals/AddBuildingModal";
import AddRoomModal from "../modals/AddRoomModal";
import AddShopModal from "../modals/AddShopModal";

const Building = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);

  // Fetch all buildings (overview)
  const fetchBuildings = async () => {
    try {
      const res = await axiosInstance.get("/api/buildings");
      setBuildings(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching buildings:", err);
    }
  };

  // Fetch building details (rooms & tenants)
  const fetchBuildingDetails = async (id, overviewData) => {
    setLoadingDetails(true);
    setSelectedBuilding(overviewData); // show overview immediately
    try {
      const res = await axiosInstance.get(`/api/buildings/${id}`);
      const building = res.data?.data || overviewData;

      const roomsWithTenants = (building.rooms || []).map((room) => ({
        ...room,
        tenants: room.tenants || [],
      }));

      setSelectedBuilding({ ...building, rooms: roomsWithTenants });
    } catch (err) {
      console.error("Error fetching building details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // ✅ Back button handler
  const handleBack = () => {
    setSelectedBuilding(null); // always show BuildingList
  };

  return (
    <PageWrapper title="Manage Buildings">
      <p className="p-0 m-0 text-white">.</p>
      {/* {JSON.stringify(selectedBuilding)} */}
      {/* If no building selected, show list */}
      {!selectedBuilding ? (
        <BuildingList
          buildings={buildings}
          onSelect={(b) => fetchBuildingDetails(b._id, b)}
          onAddBuilding={() => setShowBuildingModal(true)}
        />
      ) : (
        <BuildingDetails
          building={selectedBuilding}
          loading={loadingDetails}
          setSelectedBuilding={setSelectedBuilding}
          onBack={handleBack} // Back button works properly
          onAddRoom={() => setShowRoomModal(true)}
          onAddShop={() => setShowShopModal(true)}
        />
      )}

      {/* Modals */}
      {showBuildingModal && (
        <AddBuildingModal
          open={showBuildingModal}
          onClose={() => setShowBuildingModal(false)}
          onSuccess={() => {
            fetchBuildings();
            setShowBuildingModal(false);
          }}
        />
      )}

      {showRoomModal && (
        <AddRoomModal
          open={showRoomModal}
          buildingId={selectedBuilding?._id}
          onClose={() => setShowRoomModal(false)}
          onSuccess={() => {
            fetchBuildingDetails(selectedBuilding?._id, selectedBuilding);
            setShowRoomModal(false);
          }}
        />
      )}

      {showShopModal && (
        <AddShopModal
          open={showShopModal}
          buildingId={selectedBuilding?._id}
          onClose={() => setShowShopModal(false)}
          onSuccess={() => {
            fetchBuildingDetails(selectedBuilding?._id, selectedBuilding);
            setShowShopModal(false);
          }}
        />
      )}
    </PageWrapper>
  );
};

export default Building;
