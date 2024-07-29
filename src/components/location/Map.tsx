import { TouristSpot, useTouristSpots } from "@/hooks/useTouristSpots";
import { useLocationStore } from "@/zustand/locationStore";
import { useEffect, useRef, useState } from "react";

const KAKAO_MAP_API = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

// 거리 계산 함수
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // 지구의 반지름 (킬로미터)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useLocationStore();
  const { data: spots, isPending, error } = useTouristSpots(latitude ?? 0, longitude ?? 0);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const [visibleSpots, setVisibleSpots] = useState<TouristSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [currentOverlay, setCurrentOverlay] = useState<kakao.maps.CustomOverlay | null>(null);

  // 이전 지도 상태를 저장하기 위한 상태
  const [previousCenter, setPreviousCenter] = useState<kakao.maps.LatLng | null>(null);
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API}&autoload=false&libraries=services`;
    script.onload = () => {
      if (window.kakao && mapContainer.current) {
        const kakao = window.kakao;

        kakao.maps.load(() => {
          const mapOptions: kakao.maps.MapOptions = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 3,
          };

          const mapInstance = new kakao.maps.Map(mapContainer.current, mapOptions);
          setMap(mapInstance);

          // 내 위치 오버레이 설정
          const myLocationCustomMarker = `
            <div class="bg-red-200 w-5 h-5 rounded-full flex items-center justify-center">
              <div class="bg-red-500 w-3 h-3 border border-white rounded-full"></div>
            </div>
          `;

          const myLocationOverlayInstance = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(latitude, longitude),
            content: myLocationCustomMarker,
          });
          myLocationOverlayInstance.setMap(mapInstance);

          const createMarkers = () => {
            if (!spots) return [];

            return spots.map((spot) => {
              const markerPosition = new kakao.maps.LatLng(spot.mapy, spot.mapx);
              const markerImageUrl = "/assets/images/marker.svg";
              const markerSize = new kakao.maps.Size(26, 40);
              const markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerSize);

              const newMarker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
              });

              kakao.maps.event.addListener(newMarker, "click", () => {
                // 선택된 마커의 이전 지도 상태를 저장
                if (mapInstance) {
                  setPreviousCenter(mapInstance.getCenter());
                  setPreviousLevel(mapInstance.getLevel());
                }
                setSelectedSpot(spot);
              });

              return newMarker;
            });
          };

          const updateMarkers = () => {
            if (!mapInstance || !spots) return;

            markers.forEach((marker) => marker.setMap(null)); // 기존 마커 삭제
            const newMarkers = createMarkers();
            setMarkers(newMarkers);

            newMarkers.forEach((marker) => marker.setMap(mapInstance)); // 새로운 마커 추가
          };

          const updateVisibleSpots = () => {
            if (!mapInstance || !spots) return;

            const bounds = mapInstance.getBounds();
            if (!bounds) return;

            const visibleSpots = spots.filter((spot) => {
              const position = new kakao.maps.LatLng(spot.mapy, spot.mapx);
              return bounds.contain(position);
            });
            setVisibleSpots(visibleSpots);
          };

          kakao.maps.event.addListener(mapInstance, "idle", () => {
            updateMarkers();
            updateVisibleSpots();
          });

          kakao.maps.event.addListener(mapInstance, "zoom_changed", () => {
            updateMarkers();
            updateVisibleSpots();

            const currentZoomLevel = mapInstance.getLevel();
            if (currentZoomLevel > 8) {
              mapInstance.setLevel(8);
            }
          });

          updateMarkers();
          updateVisibleSpots();
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [latitude, longitude, spots]);

  useEffect(() => {
    if (map && selectedSpot) {
      const position = new window.kakao.maps.LatLng(selectedSpot.mapy, selectedSpot.mapx);
      map.setCenter(position);
      map.setLevel(4);

      // 선택된 스팟의 인포윈도우 생성
      const infoWindowContent = `
      <div class="info-window" style="padding: 10px; border-radius: 5px; background: white; border: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between; overflow: visible;">
        <a href="/detail/${selectedSpot.contentid}" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
          <div style="font-size: 20px; font-weight: bold; margin-right: 5px;">${selectedSpot.title}</div>
          <img src="/assets/images/arrow.svg" alt="화살표" style="width: 20px; height: 20px; object-fit: cover;" />
        </a>
      </div>
    `;

      const infoWindow = new window.kakao.maps.CustomOverlay({
        position: position,
        content: infoWindowContent,
        yAnchor: 1.5,
      });

      if (currentOverlay) {
        currentOverlay.setMap(null);
      }

      infoWindow.setMap(map);
      setCurrentOverlay(infoWindow);
    }
  }, [map, selectedSpot]);

  const moveToCurrentLocation = () => {
    if (map && latitude !== null && longitude !== null) {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
      map.setCenter(moveLatLon);
      map.setLevel(4);
    }
  };

  const handleBackToList = () => {
    if (map && previousCenter && previousLevel !== null) {
      map.setCenter(previousCenter); // 이전 중심 위치로 이동
      map.setLevel(previousLevel); // 이전 확대 수준으로 변경
    }
    setSelectedSpot(null);

    // 기존 커스텀 오버레이 제거
    if (currentOverlay) {
      currentOverlay.setMap(null);
      setCurrentOverlay(null);
    }
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="relative">
      <div ref={mapContainer} className="w-full md:h-[60vh]" />
      <button
        onClick={moveToCurrentLocation}
        className="absolute top-2 left-2 z-10 bg-white text-white p-3 rounded-full flex items-center shadow-xl"
      >
        <img src="/assets/images/my_location.svg" alt="내 위치" className="w-4 h-4" />
      </button>
      <div className="mx-10 my-2 rounded-lg md:mx-10 md:my-2">
        {selectedSpot ? (
          <div className="flex flex-col md:flex-row items-start my-4">
            <div>
              {selectedSpot.firstimage ? (
                <img
                  src={selectedSpot.firstimage}
                  alt={selectedSpot.title}
                  className="w-[400px] h-[280px] object-cover rounded my-4"
                />
              ) : (
                <img
                  src="/assets/images/null_image.svg"
                  alt="No Image"
                  className="w-[400px] h-[280px] object-cover rounded my-4"
                />
              )}
            </div>
            <div className="md:ml-10 mt-8">
              <a href={`/detail/${selectedSpot.contentid}`} className="flex items-center">
                <span className="text-[30px] font-bold mr-4">{selectedSpot.title}</span>
                <span className="border-b-2 border-primary-300 text-primary-300 text-[18px]">더보기</span>
              </a>
              <p className="text-secondary-700 text-[18px] mt-2">
                {getDistance(latitude!, longitude!, selectedSpot.mapy, selectedSpot.mapx).toFixed(2)} km
              </p>
              <p className="text-grey-800 mt-2 text-[18px]">{selectedSpot.address}</p>
              <p className="text-grey-800 mt-2 text-[18px]">{selectedSpot.tel}</p>
              {selectedSpot.firstimage ? (
                <img
                  src={selectedSpot.firstimage}
                  alt={selectedSpot.title}
                  className="w-[360px] h-[270px] md:hidden rounded"
                />
              ) : (
                <img
                  src="/assets/images/null_image.svg"
                  alt="No Image"
                  className="w-[360px] h-[270px] md:hidden rounded"
                />
              )}
              <button onClick={handleBackToList} className="mt-4 px-4 py-2 bg-primary-300 text-white rounded">
                목록으로 돌아가기
              </button>
            </div>
          </div>
        ) : visibleSpots.length > 0 ? (
          <ul>
            {visibleSpots.map((spot, index) => {
              const distance = getDistance(latitude!, longitude!, spot.mapy, spot.mapx);
              return (
                <li
                  key={index}
                  data-title={spot.title}
                  className="flex items-center py-6 border-b border-grey-200 cursor-pointer"
                  onClick={() => setSelectedSpot(spot)}
                >
                  {spot.firstimage ? (
                    <img src={spot.firstimage} alt={spot.title} className="w-48 h-32 object-cover mr-8 rounded" />
                  ) : (
                    <img
                      src="/assets/images/null_image.svg"
                      alt={spot.title}
                      className="w-48 h-32 object-cover mr-8 rounded"
                    />
                  )}
                  <div className="flex items-center">
                    <img src="/assets/images/marker.svg" alt="Marker" className="h-10 mr-6" />
                    <div>
                      <p className="text-secondary-800 text-[26px] mb-2 font-bold">{spot.title}</p>
                      <div className="flex items-center">
                        <p className="text-secondary-700 text-[18px]">{distance.toFixed(2)} km</p>
                        <span className="border-l border-gray-300 h-6 mx-5"></span>
                        <span className="text-grey-800 text-[20px]">{spot.address}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-grey-300 mt-10 text-[24px] font-bold">지도를 옮겨주세요</p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
