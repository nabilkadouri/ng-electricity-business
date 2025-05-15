import { ApiResponse } from "./ApiResponse";
import { BookingInterface } from "./BookingInterface";
import { ChargingStationInterface } from "./ChargingStationInterface";

export interface UserInterface extends ApiResponse {
    id: number,
    email: string,
    name: string,
    firstName: string,
    address: string,
    postaleCode: string,
    city: string,
    phoneNumber: string,
    ownsStation: boolean,
    bookings: BookingInterface[],
    chargingStations: ChargingStationInterface[]
}