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
  const [currentOverlay, setCurrentOverlay] = useState<kakao.maps.CustomOverlay | null>(null); // 현재 오버레이 상태 관리

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
            level: 4,
          };

          const mapInstance = new kakao.maps.Map(mapContainer.current, mapOptions);
          setMap(mapInstance);

          // 마커 이미지 URL
          const markerImageUrl = "/assets/images/marker.svg";

          const createMarkers = () => {
            if (!spots) return [];

            return spots.map((spot) => {
              const markerPosition = new kakao.maps.LatLng(spot.mapy, spot.mapx);
              const isSelected = selectedSpot?.contentid === spot.contentid; // 선택된 마커 확인
              const markerSize = new kakao.maps.Size(36, 60); // 마커 크기

              const markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerSize);

              const newMarker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
              });

              // 커스텀 오버레이 HTML 템플릿
              const overlayContent = `
                <div class="bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
                  <img src="${spot.firstimage || "/assets/images/null_image.svg"}" alt="${
                spot.title
              }" class="w-32 h-32 object-cover rounded mb-2" />
                  <div class="font-semibold text-gray-800">${spot.title}</div>
                </div>
              `;

              kakao.maps.event.addListener(newMarker, "click", () => {
                // 이전 오버레이 제거
                if (currentOverlay) {
                  currentOverlay.setMap(null);
                }

                // 새로운 오버레이 생성 및 설정
                const newOverlay = new kakao.maps.CustomOverlay({
                  position: markerPosition,
                  content: overlayContent,
                  yAnchor: 1,
                });
                newOverlay.setMap(mapInstance);
                setCurrentOverlay(newOverlay); // 현재 오버레이 상태 업데이트
                setSelectedSpot(spot); // 선택된 관광지 설정
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
    setSelectedSpot(null);
    if (map) {
      map.setCenter(new kakao.maps.LatLng(latitude!, longitude!));
      map.setLevel(4);
    }
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.message}</div>;

  return (
    <div className="relative h-full">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} className="absolute top-0 left-0" />
      <button
        onClick={moveToCurrentLocation}
        className="absolute right-2 bottom-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        현재 위치로 이동
      </button>
      <div className="absolute top-0 left-0 w-full h-full overflow-auto">
        <div className="p-4">
          {selectedSpot ? (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 md:hidden">
                {selectedSpot.firstimage ? (
                  <img src={selectedSpot.firstimage} alt={selectedSpot.title} className="w-auto h-60 mt-2 rounded" />
                ) : (
                  <img src="/assets/images/null_image.svg" alt="No Image" className="w-auto h-60 mt-2 rounded" />
                )}
                <p className="text-gray-700 mt-2">{selectedSpot.tel}</p>
                <button onClick={handleBackToList} className="mt-4 px-4 py-2 bg-[#FF5C00] text-white rounded">
                  목록으로 돌아가기
                </button>
              </div>
              <div className="hidden md:block md:flex-1">
                {selectedSpot.firstimage ? (
                  <img
                    src={selectedSpot.firstimage}
                    alt={selectedSpot.title}
                    className="w-auto h-60 object-cover rounded"
                  />
                ) : (
                  <img
                    src="/assets/images/null_image.svg"
                    alt="No Image"
                    className="w-auto h-60 object-cover rounded"
                  />
                )}
              </div>
            </div>
          ) : (
            <ul>
              {visibleSpots.map((spot, index) => {
                const distance = getDistance(latitude!, longitude!, spot.mapy, spot.mapx);
                return (
                  <li
                    key={index}
                    data-title={spot.title}
                    className="flex items-center mb-6 pb-2 border-b border-gray-200 cursor-pointer"
                    onClick={() => {
                      setSelectedSpot(spot); // 마커 클릭 시 선택된 관광지 설정
                    }}
                  >
                    {spot.firstimage ? (
                      <img src={spot.firstimage} alt={spot.title} className="w-16 h-16 object-cover mr-4 rounded" />
                    ) : (
                      <img
                        src="/assets/images/null_image.svg"
                        alt={spot.title}
                        className="w-16 h-16 object-cover mr-4 rounded"
                      />
                    )}
                    <div className="flex items-center">
                      <img src="/assets/images/marker.svg" alt="Marker" className="w-4 h-4 mr-2" />
                      <div>
                        <strong className="text-black">{spot.title}</strong>
                        <p className="text-gray-400 text-sm">{distance.toFixed(2)} km</p>
                        <p className="text-gray-700">{spot.address}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
