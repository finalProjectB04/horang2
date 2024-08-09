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
    <div className="w-full h-[500px] relative tablet:w-full tablet:h-[400px] desktop:w-full desktop:h-[500px] mobile:w-[375px]">
      <h1
        className="text-start py-[65px] font-extrabold tablet:text-start tablet:py-[45px] tablet:font-semibold tablet:text-[30px] desktop:text-start desktop:py-[65px] desktop:font-bold desktop:text-[38px] mobile:px-[24px]
      mobile:text-[14px] mobile:font-bold mobile:mb-[-40px] mobile:leading-[24px]"
      >
        위치
      </h1>
      <div id="map" className="w-full h-full"></div>
    </div>
  );
};

export default KakaoMap;
