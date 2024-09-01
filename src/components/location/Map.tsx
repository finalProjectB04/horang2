import LoadingPage from "@/app/loading";
import { TouristSpot, useTouristSpots } from "@/hooks/useTouristSpots";
import { convertToHttps } from "@/utils/convertToHttps";
import { useLocationStore } from "@/zustand/locationStore";
import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DetailPageLikeButton from "../detailpage/DetailPageLikeButton";

const KAKAO_MAP_API = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
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
  const [previousCenter, setPreviousCenter] = useState<kakao.maps.LatLng | null>(null);
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const { id: userId } = useUserStore();

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

          const handleMapEvents = () => {
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
          };

          handleMapEvents();
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
      if (map) {
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);
      }
    };
  }, [latitude, longitude, spots]);

  useEffect(() => {
    if (map && selectedSpot) {
      const position = new window.kakao.maps.LatLng(selectedSpot.mapy, selectedSpot.mapx);
      map.setCenter(position);
      map.setLevel(4);

      const infoWindowContent = `
      <a href="/detail/${selectedSpot.contentid}" class="info-window" style="padding: 10px; border-radius: 5px; background: white; border: 1px solid #ddd; display: flex; align-items: center; text-decoration: none;">
        <p style="font-size: 18px; font-weight: bold; margin-right: 5px; flex-grow: 1;">
          ${selectedSpot.title}
        </p>
        <img src="/assets/images/arrow.svg" alt="화살표" style="width: 20px; height: 20px; flex-shrink: 1;" />
      </a>
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
      map.setCenter(previousCenter);
      map.setLevel(previousLevel);
    }
    setSelectedSpot(null);

    // 기존 커스텀 오버레이 제거
    if (currentOverlay) {
      currentOverlay.setMap(null);
      setCurrentOverlay(null);
    }
  };

  if (isPending) return <LoadingPage />;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="relative flex flex-col lg:flex-row h-[90vh]">
      <div className="relative flex-1 lg:w-2/3">
        <div ref={mapContainer} className="w-full h-full" />
        <button
          onClick={moveToCurrentLocation}
          className="absolute top-4 left-4 z-10 bg-white text-white p-3 rounded-full flex items-center shadow-xl"
        >
          <Image src="/assets/images/my_location.svg" alt="내 위치" width={20} height={20} />
        </button>
      </div>
      <div className="relative flex-1 lg:w-1/3 overflow-y-auto">
        {selectedSpot ? (
          <div className="flex flex-col md:flex-row items-start m-10 sm:m-6">
            <div className="w-full md:w-1/2">
              {selectedSpot.imageUrl ? (
                <Image
                  src={convertToHttps(selectedSpot.imageUrl)}
                  alt={selectedSpot.title}
                  width={200}
                  height={140}
                  className="h-[180px] sm:h-[120px] w-full object-cover rounded"
                />
              ) : (
                <Image
                  src="/assets/images/null_image.svg"
                  alt="No Image"
                  width={200}
                  height={140}
                  className="h-[180px] sm:h-[120px] w-full object-cover rounded"
                />
              )}
            </div>
            <div className="md:ml-10 md:mt-0 mt-8 md:w-1/2">
              <div className="flex flex-row">
                <a href={`/detail/${selectedSpot.contentid}`} className="flex items-center mb-1">
                  <span className="text-[20px] lg:text-[24px] font-bold mr-4">{selectedSpot.title}</span>
                  <span className="border-b-2 border-primary-300 text-primary-300 text-[12px] lg:text-[14px] mr-10">
                    더보기
                  </span>
                </a>
                <DetailPageLikeButton
                  contentId={selectedSpot.contentid || ""}
                  title={selectedSpot.title || ""}
                  imageUrl={selectedSpot.imageUrl || "/assets/images/null_image.svg"}
                  contentTypeId={selectedSpot.contentTypeId || "12"}
                  addr1={selectedSpot.address || ""}
                  tel={selectedSpot.tel || ""}
                  userId={userId || ""}
                />
              </div>

              <p className="text-secondary-700 text-[14px] lg:text-[16px]">
                {getDistance(latitude!, longitude!, selectedSpot.mapy, selectedSpot.mapx).toFixed(2)} km
              </p>
              <p className="text-grey-800 mt-2 text-[14px] lg:text-[16px]">{selectedSpot.address}</p>
              <p className="text-grey-800 mt-2 text-[14px] lg:text-[16px]">{selectedSpot.tel}</p>
              <button
                onClick={handleBackToList}
                className="mt-8 px-4 py-2 bg-primary-300 text-white rounded text-[14px] sm:text-[12px]"
              >
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
                  className="flex items-center py-6 border-b border-grey-200 cursor-pointer text-sm md:text-[14px]"
                  onClick={() => setSelectedSpot(spot)}
                >
                  {spot.imageUrl ? (
                    <Image
                      src={convertToHttps(spot.imageUrl)}
                      alt={spot.title}
                      width={192}
                      height={128}
                      className="w-36 h-28 sm:w-30 sm:h-18 object-cover ml-6 mr-8  sm:mr-6 rounded"
                    />
                  ) : (
                    <Image
                      src="/assets/images/null_image.svg"
                      alt={spot.title}
                      width={192}
                      height={128}
                      className="w-36 h-28 sm:w-30 sm:h-18 object-cover ml-6 mr-8 sm:mr-6 rounded"
                    />
                  )}
                  <div className="flex flex-col mr-6">
                    <div className="flex items-center mb-2">
                      <p className="text-secondary-800 text-[16px] lg:text-[18px] font-bold mr-4">{spot.title}</p>
                      <DetailPageLikeButton
                        contentId={spot.contentid || ""}
                        imageUrl={spot.imageUrl || "/assets/images/null_image.svg"}
                        contentTypeId={spot.contentTypeId || "12"}
                        addr1={spot.address || ""}
                        title={spot.title || ""}
                        tel={spot.tel || ""}
                        userId={userId || ""}
                      />
                    </div>
                    <p className="text-secondary-700 text-[12px] lg:text-[14px]">{distance.toFixed(2)} km</p>
                    <p className="text-grey-800 text-[14px] leading-6 mt-2 sm:mt-1">{spot.address}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-grey-300 mt-10 text-[18px] font-bold">지도를 옮겨주세요</p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
