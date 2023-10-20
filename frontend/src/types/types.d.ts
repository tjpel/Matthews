type RadarGeocodeLayer =
  | 'place'
  | 'address'
  | 'intersection'
  | 'street'
  | 'neighborhood'
  | 'postalCode'
  | 'locality'
  | 'county'
  | 'state'
  | 'country'
  | 'coarse'
  | 'fine';
interface RadarAddress {
  addressLabel?: string;
  borough?: string;
  city?: string;
  confidence?: 'exact' | 'interpolated' | 'fallback';
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  county?: string;
  distance?: number;
  dma?: string;
  dmaCode?: string;
  formattedAddress?: string;
  geometry: GeoJSON.Point;
  latitude: number;
  longitude: number;
  layer?: RadarGeocodeLayer;
  neighborhood?: string;
  number?: string;
  placeLabel?: string;
  postalCode?: string;
  state?: string;
  stateCode?: string;
  street?: string;
}
interface RadarAutocompleteAddress extends RadarAddress {
  unit?: string;
}
