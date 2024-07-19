import { useTouristSpots } from "@/axios/location";
import { useLocationStore } from "@/zustand/locationStore";
import { useEffect, useRef } from "react";

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useLocationStore();
  const { data: spots } = useTouristSpots(latitude, longitude);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&autoload=false`;
    script.onload = () => {
      if (window.kakao && mapContainer.current) {
        const kakao = window.kakao;

        kakao.maps.load(() => {
          const mapOptions = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 5,
          };

          const map = new kakao.maps.Map(mapContainer.current, mapOptions);

          if (spots) {
            spots.forEach((spot: any) => {
              const markerPosition = new kakao.maps.LatLng(spot.mapy, spot.mapx);
              const marker = new kakao.maps.Marker({ position: markerPosition });
              marker.setMap(map);

              const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="padding:5px;">${spot.title}</div>`,
              });

              kakao.maps.event.addListener(marker, "mouseover", () => infowindow.open(map, marker));
              kakao.maps.event.addListener(marker, "mouseout", () => infowindow.close());
            });
          }
        });
      }
    };

    document.head.appendChild(script);
  }, [latitude, longitude, spots]);

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;
