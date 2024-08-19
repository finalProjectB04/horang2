"use client";
import { useModal } from "@/context/modal.context";
import React, { useEffect } from "react";

interface KakaoMapProps {
  mapx: number;
  mapy: number;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ mapx, mapy }) => {
  const longitude = mapx;
  const latitude = mapy;
  const modal = useModal();

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
          modal.open({
            title: "에러",
            content: (
              <div className="text-center">
                <p>맵 컨테이너를 찾을수 없습니다.</p>
              </div>
            ),
          });
        }
      });
    };

    script.onerror = () => {
      modal.open({
        title: "에러",
        content: (
          <div className="text-center">
            <p>카카오 맵 스크립트 로드 실패.</p>
          </div>
        ),
      });
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [longitude, latitude]);

  return (
    <div className="w-full relative md:w-full lg:w-full sm:w-full">
      <h1 className="text-start font-extrabold md:text-start md:py-[45px] md:px-[32px] md:font-semibold md:text-[17px] lg:text-start lg:py-[21px] lg:font-bold lg:text-[19px] sm:px-[24px] sm:text-[14px] sm:mt-10 sm:pb-5 sm:font-bold sm:leading-[24px]">
        위치
      </h1>
      <div id="map" className="w-full md:h-[342px] lg:h-[427px] sm:h-[256px]"></div>
    </div>
  );
};

export default React.memo(KakaoMap);
