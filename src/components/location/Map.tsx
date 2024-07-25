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
  const infoContainer = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useLocationStore();
  const { data: spots, isPending, error } = useTouristSpots(latitude ?? 0, longitude ?? 0);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const [visibleSpots, setVisibleSpots] = useState<TouristSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [myLocationOverlay, setMyLocationOverlay] = useState<kakao.maps.CustomOverlay | null>(null);

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
          setMyLocationOverlay(myLocationOverlayInstance); // 상태로 관리

          const createMarkers = () => {
            if (!spots) return [];

            return spots.map((spot) => {
              const markerPosition = new kakao.maps.LatLng(spot.mapy, spot.mapx);
              const isSelected = selectedSpot?.contentid === spot.contentid; // 선택된 마커 확인
              const markerImageUrl = "/assets/images/marker.svg";
              const markerSize = isSelected ? new kakao.maps.Size(36, 60) : new kakao.maps.Size(26, 40); // 크기 조정

              const markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerSize);

              const newMarker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
              });

              const infowindow = new kakao.maps.InfoWindow({
                content: `<div class="p-1">${spot.title}</div>`,
              });

              kakao.maps.event.addListener(newMarker, "mouseover", () => infowindow.open(mapInstance, newMarker));
              kakao.maps.event.addListener(newMarker, "mouseout", () => {
                // 선택된 마커가 아닌 경우에만 infowindow를 닫습니다.
                if (!isSelected) infowindow.close();
              });

              kakao.maps.event.addListener(newMarker, "click", () => {
                setSelectedSpot(spot);
                if (map) {
                  const position = new kakao.maps.LatLng(spot.mapy, spot.mapx);
                  map.setCenter(position); // 마커 클릭 시 지도 중심 이동
                  map.setLevel(4);
                  infowindow.open(map, newMarker); // 클릭 시 infowindow 열기
                }
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
  }, [latitude, longitude, spots, selectedSpot]);

  useEffect(() => {
    if (map && selectedSpot) {
      const position = new window.kakao.maps.LatLng(selectedSpot.mapy, selectedSpot.mapx);
      map.setCenter(position); // 선택된 마커 위치로 지도 중심 이동
      map.setLevel(4);
    }
  }, [selectedSpot, map]); // selectedSpot이 변경될 때마다 지도 업데이트

  useEffect(() => {
    if (myLocationOverlay && map) {
      const position = new window.kakao.maps.LatLng(latitude ?? 0, longitude ?? 0);
      myLocationOverlay.setPosition(position); // 내 위치 업데이트
    }
  }, [latitude, longitude, myLocationOverlay, map]); // 내 위치 업데이트

  const moveToCurrentLocation = () => {
    if (map && latitude !== null && longitude !== null) {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
      map.setCenter(moveLatLon);
      map.setLevel(4);
    }
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="relative">
      <div ref={mapContainer} className="w-full h-96" />
      <button
        onClick={moveToCurrentLocation}
        className="absolute top-2 left-2 z-10 bg-white text-white p-3 rounded-full flex items-center shadow-xl"
      >
        <img src="/assets/images/my_location.svg" alt="내 위치" className="w-4 h-4" />
      </button>
      <div className="p-4 bg-white mt-4 z-10 rounded-t-lg shadow">
        <div ref={infoContainer}>
          {selectedSpot ? (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1">
                <h4 className="text-[28px] font-bold">{selectedSpot.title}</h4>
                <p className="text-gray-400 text-[16px]">
                  {getDistance(latitude!, longitude!, selectedSpot.mapy, selectedSpot.mapx).toFixed(2)} km
                </p>
                <p className="text-gray-700 mt-2">{selectedSpot.address}</p>
                {selectedSpot.firstimage ? (
                  <img src={selectedSpot.firstimage} alt={selectedSpot.title} className="w-auto h-60 mt-2 md:hidden rounded" />
                ) : (
                  <img src="/assets/images/null_image.svg" alt="No Image" className="w-auto h-60 mt-2 md:hidden rounded" />
                )}
                <p className="text-gray-700 mt-2">{selectedSpot.tel}</p>
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="mt-4 px-4 py-2 bg-[#FF5C00] text-white rounded"
                >
                  목록으로 돌아가기
                </button>
              </div>
              <div className="hidden md:block md:flex-1">
                {selectedSpot.firstimage ? (
                  <img src={selectedSpot.firstimage} alt={selectedSpot.title} className="w-auto h-60 object-cover rounded" />
                ) : (
                  <img src="/assets/images/null_image.svg" alt="No Image" className="w-auto h-60 object-cover rounded" />
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
                    className={`flex items-center mb-6 pb-2 border-b border-gray-200 cursor-pointer`} // mb-6로 변경하여 목록 간의 여백 넓힘
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
                      <img src="/assets/images/marker.svg" alt="Marker" className="w-4 h-4 mr-2" /> {/* 마커 이미지 추가 */}
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
