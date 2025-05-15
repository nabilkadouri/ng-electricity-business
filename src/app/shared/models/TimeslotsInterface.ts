import { ApiResponse } from "./ApiResponse";
import { ChargingStationInterface } from "./ChargingStationInterface";

export interface TimeslotsInterface extends ApiResponse {
    id: number,
    dayOfWeek: string,
    startTime: Date,
    endTime: Date,
    chargingStation: ChargingStationInterface
}