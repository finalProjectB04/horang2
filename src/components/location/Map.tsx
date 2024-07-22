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
  const { latitude, longitude } = useLocationStore();
  const { data: spots, isPending, error } = useTouristSpots(latitude ?? 0, longitude ?? 0);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [clusterer, setClusterer] = useState<kakao.maps.MarkerClusterer | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API}&autoload=false&libraries=services,clusterer`;
    script.onload = () => {
      if (window.kakao && mapContainer.current) {
        const kakao = window.kakao;

        kakao.maps.load(() => {
          const mapOptions: kakao.maps.MapOptions = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 5, // 초기 줌 레벨
          };

          const mapInstance = new kakao.maps.Map(mapContainer.current, mapOptions);
          setMap(mapInstance);

          const userMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(latitude, longitude),
            title: "현재 위치",
            map: mapInstance,
          });

          // 클러스터러 인스턴스 생성
          const clustererInstance = new kakao.maps.MarkerClusterer({
            map: mapInstance,
            averageCenter: true,
            minClusterSize: 2,
          });
          setClusterer(clustererInstance);

          const updateMarkers = () => {
            if (!mapInstance || !spots) return;

            // 클러스터러에서 기존 마커 제거
            clustererInstance.clear();

            const newMarkers: kakao.maps.Marker[] = [];
            const distanceThreshold = 10; // 10km

            spots.forEach((spot) => {
              const markerPosition = new kakao.maps.LatLng(spot.mapy, spot.mapx);
              const distance = getDistance(latitude, longitude, spot.mapy, spot.mapx);

              if (distance <= distanceThreshold) {
                // 10km 이내의 관광지는 개별 마커로 표시
                const marker = new kakao.maps.Marker({ position: markerPosition });
                newMarkers.push(marker);

                const infowindow = new kakao.maps.InfoWindow({
                  content: `<div style="padding:4px;">${spot.title}</div>`,
                });

                kakao.maps.event.addListener(marker, "mouseover", () => infowindow.open(mapInstance, marker));
                kakao.maps.event.addListener(marker, "mouseout", () => infowindow.close());

                marker.setMap(mapInstance);
              }
            });

            // 10km 이상의 관광지는 클러스터러로 표시
            const otherMarkers: kakao.maps.Marker[] = spots
              .filter((spot) => getDistance(latitude, longitude, spot.mapy, spot.mapx) > distanceThreshold)
              .map((spot) => new kakao.maps.Marker({ position: new kakao.maps.LatLng(spot.mapy, spot.mapx) }));

            clustererInstance.addMarkers(otherMarkers);
          };

          const handleZoomChange = () => {
            if (mapInstance && clustererInstance) {
              const currentZoomLevel = mapInstance.getLevel();

              if (currentZoomLevel > 6) {
                // 줌 레벨이 6보다 크면 마커 업데이트
                updateMarkers();
              } else {
                // 줌 레벨이 6 이하이면 클러스터링 표시
                const currentMarkers = clustererInstance.getMarkers() as kakao.maps.Marker[];
                clustererInstance.addMarkers(currentMarkers);
              }
            }
          };

          kakao.maps.event.addListener(mapInstance, "idle", handleZoomChange);
          kakao.maps.event.addListener(mapInstance, "zoom_changed", handleZoomChange);

          // 초기 마커 업데이트
          updateMarkers();
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

  // 현재 위치로 이동 함수
  const moveToCurrentLocation = () => {
    if (map && latitude !== null && longitude !== null) {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
      map.setCenter(moveLatLon);
    }
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "480px" }} />
      <button onClick={moveToCurrentLocation} style={{ position: "absolute", top: "10px", left: "10px", zIndex: 10 }}>
        내 위치로 이동
      </button>
      <div style={{ padding: "10px", background: "#fff", border: "1px solid #ddd", marginTop: "10px" }}>
        <h3>관광지 리스트</h3>
        <ul>
          {spots &&
            spots.map((spot, index) => {
              const distance = getDistance(latitude!, longitude!, spot.mapy, spot.mapx);
              return (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <strong>{spot.title}</strong> - {distance.toFixed(2)} km
                  <br />
                  주소: {spot.address}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;
