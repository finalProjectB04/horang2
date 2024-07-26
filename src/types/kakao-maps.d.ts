declare namespace kakao.maps {
  type Map = {
    getBounds(): LatLngBounds;
    relayout(): void;
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
    getLevel(): number;
    setBounds(bounds: LatLngBounds): void; // 여기에 추가
  };

  type LatLngBounds = {
    contains(latlng: LatLng): boolean;
    extend(latlng: LatLng): void;
    // 추가적인 메서드가 필요한 경우 여기에 추가할 수 있습니다.
  };

  type LatLng = {
    constructor(lat: number, lng: number): LatLng;
  };

  type Marker = {
    setMap(map: Map | null): void;
    setImage(image: Image): void;
  };

  type InfoWindow = {
    setContent(content: string): void;
    open(map: Map, marker: Marker): void;
    close(): void;
  };

  type MapOptions = {
    center: LatLng;
    level: number;
  };

  type MarkerOptions = {
    position: LatLng;
  };

  type InfoWindowOptions = {
    content: string;
  };

  type MarkerClusterer = {
    addMarkers(markers: Marker[]): void;
    clear(): void;
  };

  type CustomOverlay = {
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
    setContent(content: string): void;
  };

  type CustomOverlayOptions = {
    position: LatLng;
    content: string;
  };

  function load(callback: () => void): void;
  function LatLng(lat: number, lng: number): LatLng;
  function Marker(options: MarkerOptions): Marker;
  function InfoWindow(options: InfoWindowOptions): InfoWindow;
  function Map(container: HTMLElement, options: MapOptions): Map;
  function MarkerClusterer(options: { map: Map; averageCenter: boolean; minClusterSize: number }): MarkerClusterer;
  function CustomOverlay(options: CustomOverlayOptions): CustomOverlay;
}
