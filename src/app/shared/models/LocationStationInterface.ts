

export interface LocationStationResponseInterface {
    id: number ,
    locationName: string,
    address: string,
    postaleCode: string,
    city: string,
    latitude: number,
    longitude: number,
}

export interface LocationStationRequestInterface {
    locationName?: string,
    address: string,
    postaleCode: string,
    city: string,
    latitude?: number,
    longitude?: number,
}

export interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
  }

export interface Coordinates {
    latitude: number;
    longitude: number;
  }