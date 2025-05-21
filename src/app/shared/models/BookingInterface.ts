import { ApiResponse } from "./ApiResponse";
import { ChargingStationInterface } from "./ChargingStationInterface";
import { LocationStationInterface } from "./LocationStationInterface";
import { UserInterface } from "./UserInterface";


export interface BookingInterface extends ApiResponse {
    id: number,
    createAt: Date,
    startDate: Date,
    endDate: Date,
    totalAmount: number,
    status: string,
    user: UserInterface,
    chargingStation?: ChargingStationInterface,
    locationStation? : LocationStationInterface
}

export interface FlattenedBooking extends BookingInterface {
    stationName: string; 
  }