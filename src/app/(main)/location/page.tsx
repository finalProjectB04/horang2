// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import Modal from "@/components/location/LocationModal";
// import { useLocationStore } from "@/zustand/locationStore";
// import PermissionGuideModal from "@/components/location/PermissionGuideModal";
// import MapComponent from "@/components/location/Map";

// const LocationPage = () => {
//   const { setLocation } = useLocationStore();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [hasAgreed, setHasAgreed] = useState(false);
//   const [showPermissionGuide, setShowPermissionGuide] = useState(false);

//   const requestLocation = useCallback(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           console.log("Location coordinates:", { latitude, longitude });
//           setLocation(latitude, longitude);
//           setHasAgreed(true);
//           localStorage.setItem("locationConsent", "true");
//           setModalOpen(false);
//         },
//         (error) => {
//           console.error(`Geolocation error: ${error.message}`);
//           if (error.code === error.PERMISSION_DENIED) {
//             localStorage.setItem("locationConsent", "false");
//             setHasAgreed(false);
//             setModalOpen(false);
//             setShowPermissionGuide(true);
//           } else {
//             alert("위치 정보를 요청하는 도중 오류가 발생했습니다.");
//           }
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0,
//         },
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//       alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
//     }
//   }, [setLocation]);

//   useEffect(() => {
//     const checkConsent = async () => {
//       const consent = localStorage.getItem("locationConsent");
//       console.log("Location consent:", consent);

//       if (consent === "true") {
//         requestLocation();
//       } else {
//         setModalOpen(true);
//       }
//     };

//     checkConsent();
//   }, [requestLocation]);

//   const handleAgree = async () => {
//     console.log("Agree button clicked");
//     requestLocation();
//   };

//   const handleClose = () => {
//     console.log("Close button clicked");
//     setModalOpen(false);
//     localStorage.setItem("locationConsent", "false");
//     setHasAgreed(false);
//     alert("위치 정보 동의가 필요합니다. 동의하셔야만 지도 기능을 사용할 수 있습니다.");
//   };

//   const handlePermissionGuideClose = () => {
//     setShowPermissionGuide(false);
//   };

//   return (
//     <div className="relative">
//       {modalOpen && !hasAgreed && <Modal isOpen={modalOpen} onClose={handleClose} onAgree={handleAgree} />}
//       {showPermissionGuide && <PermissionGuideModal onClose={handlePermissionGuideClose} />}
//       {hasAgreed && <MapComponent />}
//       {hasAgreed && (
//         <div className="text-center mt-4 mb-20">
//           <p className="text-[14px] text-grey-700">
//             내 위치 반경 50km의 관광지를 <br /> 지도에서 확인할 수 있습니다.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LocationPage;

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
