export interface MapMarkerModel<T = any> {
  title: string;
  label?: { text: string; color?: string };
  /** color set here will not change with theme */
  labelText?: { text: string; color?: string };
  iconColor?: string;
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  options?: google.maps.MarkerOptions;
  info?: T;
  id?: number | string;
}
