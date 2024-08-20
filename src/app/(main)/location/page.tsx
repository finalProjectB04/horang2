"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLocationStore } from "@/zustand/locationStore";
import PermissionGuideModal from "@/components/location/PermissionGuideModal";
import MapComponent from "@/components/location/Map";

const LocationPage = () => {
  const { setLocation } = useLocationStore();
  const [hasLocation, setHasLocation] = useState(false);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  const requestLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location coordinates:", { latitude, longitude });
          setLocation(latitude, longitude);
          setHasLocation(true);
          localStorage.setItem("locationConsent", "true");
        },
        (error) => {
          console.error(`Geolocation error: ${error.message}`);
          setShowPermissionGuide(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setShowPermissionGuide(true);
    }
  }, [setLocation]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handlePermissionGuideClose = () => {
    setShowPermissionGuide(false);
  };

  return (
    <div className="relative">
      {showPermissionGuide && <PermissionGuideModal onClose={handlePermissionGuideClose} />}
      {hasLocation && <MapComponent />}
      {hasLocation && (
        <div className="text-center mt-4 mb-20">
          <p className="text-[14px] text-grey-700">
            내 위치 반경 50km의 관광지를 <br /> 지도에서 확인할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPage;
