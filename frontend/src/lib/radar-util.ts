import Radar from 'radar-sdk-js';
import { Location, RadarAutocompleteAddress, RadarAddress } from 'radar-sdk-js/src/types';
import { Map, Marker } from 'maplibre-gl';
import * as turf from '@turf/turf';

import { RADAR_KEY } from './env';

export type AutocompleteResponse = RadarAutocompleteAddress[];

// LA coordinates
const CENTER: Location = {
  longitude: -118.26037247571433,
  latitude: 34.05895086651929
};
const CENTER_ARRAY: [number, number] = [CENTER.longitude, CENTER.latitude];
const ZOOM = 15;
// km
const RANGE = 150;

export function init() {
  Radar.initialize(RADAR_KEY);
}

export function isWithinRange(location: Location): boolean {
  const from = turf.point(CENTER_ARRAY);
  const to = turf.point([location.longitude, location.latitude]);

  return turf.distance(from, to, { units: 'kilometers' }) < RANGE;
}

export async function geocode(query: string): Promise<RadarAddress | undefined> {
  const res = await Radar.forwardGeocode({
    query,
    country: 'US'
  });

  if (res.addresses.length === 0) return
  const address = res.addresses[0];
  const location = {
    longitude: address.longitude,
    latitude: address.latitude
  };
  return isWithinRange(location) ? address : undefined;
}

export async function autocomplete(query: string): Promise<AutocompleteResponse> {
  const res = await Radar.autocomplete({
    query,
    limit: 5,
    countryCode: 'US',
    near: CENTER
  });
  return res.addresses;
}


let map: Map | undefined;

export function createMap(container: string | HTMLElement) {
  map = Radar.ui.map({
    container,
    style: 'radar-default-v1',
    center: CENTER_ARRAY,
    zoom: 8,
    interactive: false
  });
}

export function removeMap() {
  map!.remove();
}

let marker: Marker | undefined;

export function setMapMarker(location: RadarAddress) {
  if (marker) { marker.remove(); }
  const coords: [number, number] = [location.longitude, location.latitude];
  marker = Radar.ui.marker({ text: location.formattedAddress })
    .setLngLat(coords)
    .addTo(map!);
  map!.flyTo({
    center: coords,
    zoom: ZOOM
  });
}
