// DO NOT EDIT — Location & Preferences core (map, offline, geolocation, privacy, sync).

import { PMTiles, Protocol } from 'pmtiles';
import * as maplibregl from 'maplibre-gl';

let protocolRegistered = false;

export function registerPMTilesProtocol() {
  if (protocolRegistered) {
    return;
  }

  const protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);
  protocolRegistered = true;
}

export function createPMTilesSource(url: string) {
  return new PMTiles(url);
}