declare namespace kakao.maps {
  type Map = {
    getBounds(): LatLngBounds;
    relayout(): void;
    getLevel(): number; // 추가된 부분: getLevel() 메소드
  };

  type LatLngBounds = {
    contains(latlng: LatLng): boolean;
    extend(latlng: LatLng): void;
  };

  type LatLng = {
    constructor(lat: number, lng: number): LatLng;
  };

  type Marker = {
    setMap(map: Map | null): void;
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

  function load(callback: () => void): void;
  function LatLng(lat: number, lng: number): LatLng;
  function Marker(options: MarkerOptions): Marker;
  function InfoWindow(options: InfoWindowOptions): InfoWindow;
  function Map(container: HTMLElement, options: MapOptions): Map;
  function MarkerClusterer(options: { map: Map; averageCenter: boolean; minClusterSize: number }): MarkerClusterer;
}
