import { ApiResponse } from "./ApiResponse";

export interface LocationStationInterface extends ApiResponse {
    id: number,
    name: string,
    address: string,
    postaleCode: string,
    city: string,
    latitude: number,
    longitude: number,
    chargingStations: []
}