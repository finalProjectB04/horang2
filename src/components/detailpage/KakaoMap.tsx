"use client";
import { useEffect } from "react";

interface KakaoMapProps {
  mapx: number;
  mapy: number;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ mapx, mapy }) => {
  const longitude = mapx;
  const latitude = mapy;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");

        if (mapContainer) {
          const mapOption = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 4,
          };

          const map = new window.kakao.maps.Map(mapContainer, mapOption);

          const imageSrc = "/assets/images/marker.svg";
          const imageSize = new window.kakao.maps.Size(64, 69);
          const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

          const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
          const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

          const marker = new window.kakao.maps.Marker({
            image: markerImage,
            position: markerPosition,
          });

          marker.setMap(map);

          window.kakao.maps.event.addListener(map, "zoom_changed", () => {
            const currentZoomLevel = map.getLevel();
            if (currentZoomLevel > 8) {
              map.setLevel(8);
            }
          });
        } else {
          console.error("Map container not found");
        }
      });
    };

    script.onerror = () => {
      console.error("Failed to load Kakao Maps script");
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [longitude, latitude]);

  return (
    <div className="w-full relative md:w-full lg:w-full sm:w-full">
      <h1 className="text-start py-[65px] font-extrabold md:text-start md:py-[45px] md:px-[32px] md:font-semibold md:text-[30px] lg:text-start lg:py-[65px] lg:font-bold lg:text-[38px] sm:px-[24px] sm:text-[14px] sm:font-bold sm:mb-[-40px] sm:leading-[24px]">
        위치
      </h1>
      <div id="map" className="w-full h-[500px] md:h-[400px] lg:h-[500px] sm:h-[300px]"></div>
    </div>
  );
};

export default KakaoMap;
