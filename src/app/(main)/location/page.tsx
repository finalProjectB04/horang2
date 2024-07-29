"use client";

import Modal from "@/components/location/LocationModal";
import MapComponent from "@/components/location/Map";
import { useLocationStore } from "@/zustand/locationStore";
import React, { useEffect, useState } from "react";

const LocationPage = () => {
  const { setLocation } = useLocationStore();
  const [modalOpen, setModalOpen] = useState(true);
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleAgree = () => {
    setModalOpen(false);
    setHasAgreed(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    // 여기에 추가적인 처리를 할 수 있습니다. 예를 들어, 사용자에게 알림을 표시할 수 있습니다.
  };

  useEffect(() => {
    if (hasAgreed && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude);
        },
        (error) => {
          console.error(`Geolocation error: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [hasAgreed, setLocation]);

  return (
    <div className="relative">
      <Modal isOpen={modalOpen} onClose={handleClose} onAgree={handleAgree} />
      {hasAgreed && <MapComponent />}
      {hasAgreed && (
        <div className="text-center mt-4">
          <p className="text-lg text-grey-700">내 위치 반경 50km의 관광지를 지도에서 확인할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
};

export default LocationPage;
