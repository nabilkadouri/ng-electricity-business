import { ApiResponse } from "./ApiResponse";
import { ChargingStationInterface } from "./ChargingStationInterface";
import { LocationStationInterface } from "./LocationStationInterface";
import { UserInterface } from "./UserInterface";


export interface BookingInterface extends ApiResponse {
    id: number,
    createAt: string,
    startDate: Date,
    endDate: Date,
    totalAmount: number,
    status: string,
    chargingStation?: ChargingStationInterface,
    locationStation? : LocationStationInterface
}