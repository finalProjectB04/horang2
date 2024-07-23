import { useTouristSpots } from "@/hooks/useTouristSpots";
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
  const [visibleSpots, setVisibleSpots] = useState<any[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);

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
            level: 4, // 초기 줌 레벨
          };

          const mapInstance = new kakao.maps.Map(mapContainer.current, mapOptions);
          setMap(mapInstance);

          const userMarkerContent = `
            <div class="bg-red-200 w-5 h-5 rounded-full flex items-center justify-center">
              <div class="bg-red-500 w-3 h-3 border border-white rounded-full"></div>
            </div>
          `;

          const userMarker = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(latitude, longitude),
            content: userMarkerContent,
          });
          userMarker.setMap(mapInstance);

          const createMarkers = () => {
            if (!spots) return [];

            return spots.map((spot) => {
              const markerPosition = new kakao.maps.LatLng(spot.mapy, spot.mapx);
              const marker = new kakao.maps.Marker({ position: markerPosition });

              const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="padding:4px;">${spot.title}</div>`,
              });

              kakao.maps.event.addListener(marker, "mouseover", () => infowindow.open(mapInstance, marker));
              kakao.maps.event.addListener(marker, "mouseout", () => infowindow.close());

              kakao.maps.event.addListener(marker, "click", () => {
                setSelectedSpot(spot);
              });

              return marker;
            });
          };

          const updateMarkers = () => {
            if (!mapInstance || !spots) return;

            const newMarkers = createMarkers();
            setMarkers(newMarkers);

            newMarkers.forEach((marker) => marker.setMap(mapInstance));
          };

          const updateVisibleSpots = () => {
            if (!mapInstance || !spots) return;

            const bounds = mapInstance.getBounds();
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

  const moveToCurrentLocation = () => {
    if (map && latitude !== null && longitude !== null) {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
      map.setCenter(moveLatLon);
      map.setLevel(5);
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
        <h3 className="text-lg font-semibold mb-2">관광지 정보</h3>
        <div ref={infoContainer}>
          {selectedSpot ? (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1">
                <h4 className="text-xl font-bold">{selectedSpot.title}</h4>
                <p className="text-gray-400 text-sm">
                  {getDistance(latitude!, longitude!, selectedSpot.mapy, selectedSpot.mapx).toFixed(2)} km
                </p>
                <p className="text-gray-700">{selectedSpot.address}</p>
                {selectedSpot.image ? (
                  <img src={selectedSpot.image} alt={selectedSpot.title} className="w-full h-auto mt-2 md:hidden" />
                ) : null}
                <p className="text-gray-700 mt-2">{selectedSpot.description}</p>
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="mt-4 px-4 py-2 bg-[#FF5C00] text-white rounded"
                >
                  목록으로 돌아가기
                </button>
              </div>
              {selectedSpot.image ? (
                <div className="hidden md:block md:flex-1">
                  <img src={selectedSpot.image} alt={selectedSpot.title} className="w-full h-auto" />
                </div>
              ) : null}
            </div>
          ) : (
            <ul>
              {visibleSpots.map((spot, index) => {
                const distance = getDistance(latitude!, longitude!, spot.mapy, spot.mapx);
                return (
                  <li
                    key={index}
                    data-title={spot.title}
                    className={`flex items-center mb-2 pb-2 border-b border-gray-200`}
                  >
                    {spot.firstimage && (
                      <img src={spot.firstimage} alt={spot.title} className="w-16 h-16 object-cover mr-4" />
                    )}
                    <div>
                      <strong className="text-black">{spot.title}</strong>
                      <p className="text-gray-400 text-sm">{distance.toFixed(2)} km</p>
                      <p className="text-gray-700">{spot.address}</p>
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
