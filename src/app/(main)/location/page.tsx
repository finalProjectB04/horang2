"use client";

import React, { useEffect, useState, useCallback } from "react";
import Modal from "@/components/location/LocationModal";
import MapComponent from "@/components/location/Map";
import { useLocationStore } from "@/zustand/locationStore";
import { ScrollToTopButton } from "@/components/maindetail/ScrollToTopButton";

const LocationPage = () => {
  const { setLocation } = useLocationStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  const requestLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location coordinates:", { latitude, longitude });
          setLocation(latitude, longitude);
          setHasAgreed(true);
          localStorage.setItem("locationConsent", "true");
          setModalOpen(false);
        },
        (error) => {
          console.error(`Geolocation error: ${error.message}`);
          if (error.code === error.PERMISSION_DENIED) {
            localStorage.setItem("locationConsent", "false");
            setHasAgreed(false);
            setModalOpen(true);
            alert("위치 정보 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.");
          } else {
            alert("위치 정보를 요청하는 도중 오류가 발생했습니다.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 0,
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [setLocation]);

  useEffect(() => {
    const checkConsent = async () => {
      const consent = localStorage.getItem("locationConsent");
      console.log("Location consent:", consent);

      if (consent === "true") {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        console.log("Permission state:", permission.state);

        if (permission.state === "granted") {
          requestLocation();
        } else {
          setModalOpen(true);
          alert("위치 정보 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.");
        }
      } else {
        setModalOpen(true);
      }
    };

    checkConsent();
  }, [requestLocation]);

  const handleAgree = async () => {
    console.log("Agree button clicked");

    const permission = await navigator.permissions.query({ name: "geolocation" });
    console.log("Permission state after agree:", permission.state);

    if (permission.state === "granted" || permission.state === "prompt") {
      requestLocation();
    } else {
      localStorage.setItem("locationConsent", "false");
      setModalOpen(true);
      alert("위치 정보 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.");
    }
  };

  const handleClose = () => {
    console.log("Close button clicked");
    setModalOpen(false);
    localStorage.setItem("locationConsent", "false");
    setHasAgreed(false);
    alert("위치 정보 동의가 필요합니다. 동의하셔야만 지도 기능을 사용할 수 있습니다.");
  };

  return (
    <div className="relative">
      {modalOpen && !hasAgreed && <Modal isOpen={modalOpen} onClose={handleClose} onAgree={handleAgree} />}
      {hasAgreed && <MapComponent />}
      {hasAgreed && (
        <div className="text-center mt-4 mb-20">
          <p className="text-lg text-grey-700">내 위치 반경 50km의 관광지를 지도에서 확인할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
};

export default LocationPage;
