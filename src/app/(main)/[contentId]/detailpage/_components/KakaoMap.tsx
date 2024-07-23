import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  mapx: number;
  mapy: number;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ mapx, mapy }) => {
  //맵 x,y를 구조분해할당으로 longtitude, latitude로 대입.
  const longitude = mapx;
  const latitude = mapy;

  useEffect(() => {
    console.log("useEffect started");
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);
    console.log("Script element created and appended", script);

    script.onload = () => {
      console.log("Kakao script loaded");
      window.kakao.maps.load(() => {
        console.log("Kakao maps loaded");
        const mapContainer = document.getElementById("map");
        console.log("Map container:", mapContainer);

        if (mapContainer) {
          const mapOption = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 4,
          };
          console.log("Map option:", mapOption);

          const map = new window.kakao.maps.Map(mapContainer, mapOption);
          console.log("Map created:", map);

          const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
          console.log("Marker position:", markerPosition);

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          console.log("Marker created:", marker);

          marker.setMap(map);
          console.log("Marker set on map");
        } else {
          console.error("Map container not found");
        }
      });
    };

    script.onerror = () => {
      console.error("Failed to load Kakao script");
    };

    return () => {
      console.log("Cleanup script");
      if (script.parentNode) {
        script.parentNode.removeChild(script);
        console.log("Script removed");
      }
    };
  }, [longitude, latitude]);

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "80%", height: "500px", position: "relative" }}>
          <h1 className="text-center">Kakao Map</h1>
          <div id="map" style={{ width: "100%", height: "100%" }}></div>
        </div>
      </div>
    </>
  );
};

export default KakaoMap;
