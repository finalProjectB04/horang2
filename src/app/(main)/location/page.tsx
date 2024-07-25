"use client";

import MapComponent from "@/components/location/Map";
import { useLocationStore } from "@/zustand/locationStore";
import React, { useEffect } from "react";

const LocationPage = () => {
  const { setLocation } = useLocationStore();

  useEffect(() => {
    if ("geolocation" in navigator) {
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
  }, [setLocation]);

  return (
    <div>
      <MapComponent />
    </div>
  );
};

export default LocationPage;
